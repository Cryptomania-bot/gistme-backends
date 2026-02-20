import type { Request, Response } from "express";
import { Chat } from "../models/Chat.js";
import { Quiz } from "../models/Quiz.js";
import { QuizScore } from "../models/QuizScore.js";
import { User } from "../models/User.js";
import { Message } from "../models/Message.js";
import { getIO } from "../utils/socket.js";
import type { AuthRequest } from "../middleware/auth.js";

// Admin starts a quiz
export const createQuiz = async (req: AuthRequest, res: Response) => {
    try {
        const { groupId, title, questions } = req.body;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const group = await Chat.findOne({ _id: groupId, isGroup: true });
        if (!group) return res.status(404).json({ message: "Group not found" });

        // Check if user is admin
        if (group.admin?.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Only admin can start a quiz" });
        }

        const quiz = await Quiz.create({
            group: groupId,
            title,
            createdBy: user._id,
            questions,
            isActive: true
        });

        // Update group settings to indicate quiz is active
        group.settings = {
            onlyAdminsCanPost: group.settings?.onlyAdminsCanPost || false,
            isQuizActive: true
        };
        await group.save();

        // Create a system message for the quiz
        // We'll use the user as sender but formatted as a quiz announcement?
        // Or maybe a system user? For now let's use the creator.
        // Actually, let's create a message linked to the quiz.

        const message = await Message.create({
            chat: groupId,
            sender: user._id,
            text: `Quiz Started: ${title}`,
            quiz: quiz._id
        });

        // Populate sender for socket event
        await message.populate("sender", "name avatar");
        await message.populate("quiz", "title createdBy");

        const io = getIO();

        // Emit new message with quiz attachment
        io.to(`chat:${groupId}`).emit("new-message", message);

        // Also emit specific quiz-started event if clients listen for it specially
        io.to(`chat:${groupId}`).emit("quiz-started", {
            quizId: quiz._id,
            title: quiz.title,
            createdBy: user.name
        });

        res.status(201).json(quiz);
    } catch (error) {
        console.error("Error creating quiz:", error);
        res.status(500).json({ message: "Failed to create quiz" });
    }
};

// User submits score
export const submitScore = async (req: AuthRequest, res: Response) => {
    try {
        const { quizId, score } = req.body;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const quiz = await Quiz.findById(quizId);
        if (!quiz || !quiz.isActive) {
            return res.status(404).json({ message: "Quiz not found or not active" });
        }

        // Prevent multiple submissions
        const existingScore = await QuizScore.findOne({ user: user._id, quiz: quizId });
        if (existingScore) {
            return res.status(400).json({ message: "You have already participated in this quiz" });
        }

        const newScore = await QuizScore.create({
            user: user._id,
            quiz: quizId,
            score
        });

        res.status(201).json(newScore);
    } catch (error) {
        console.error("Error submitting score:", error);
        res.status(500).json({ message: "Failed to submit score" });
    }
};

// Get Leaderboard
export const getLeaderboard = async (req: Request, res: Response) => {
    try {
        const { quizId } = req.params;

        const scores = await QuizScore.find({ quiz: quizId })
            .sort({ score: -1 })
            .limit(20) // Top 20 as requested
            .populate("user", "name avatar");

        res.status(200).json(scores);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
};
// End Quiz
export const endQuiz = async (req: AuthRequest, res: Response) => {
    try {
        const { quizId } = req.body;
        const userId = req.userId;

        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ message: "Quiz not found" });

        const group = await Chat.findOne({ _id: quiz.group, isGroup: true });
        if (!group) return res.status(404).json({ message: "Group not found" });

        if (group.admin?.toString() !== userId) {
            return res.status(403).json({ message: "Only admin can end the quiz" });
        }

        quiz.isActive = false;
        await quiz.save();

        group.settings = {
            onlyAdminsCanPost: group.settings?.onlyAdminsCanPost || false,
            isQuizActive: false
        };
        await group.save();

        // Socket Broadcast
        const { getIO } = await import("../utils/socket.js");
        getIO().to(`chat:${group._id}`).emit("quiz-ended", { quizId });

        res.status(200).json({ message: "Quiz ended" });
    } catch (error) {
        console.error("Error ending quiz:", error);
        res.status(500).json({ message: "Failed to end quiz" });
    }
};

// Get Quiz By ID (for play screen — strips correct answers before sending)
export const getQuizById = async (req: AuthRequest, res: Response) => {
    try {
        const { quizId } = req.params;
        const userId = req.userId;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const quiz = await Quiz.findById(quizId).populate("createdBy", "name avatar");
        if (!quiz) return res.status(404).json({ message: "Quiz not found" });

        // Verify the caller is a member of the quiz's group
        const group = await Chat.findOne({ _id: quiz.group, participants: userId });
        if (!group) return res.status(403).json({ message: "You are not a member of this group" });

        // Sanitize: strip correctOptionIndex so client cannot read answers
        const sanitized = {
            _id: quiz._id,
            title: quiz.title,
            isActive: quiz.isActive,
            createdBy: quiz.createdBy,
            group: quiz.group,
            createdAt: quiz.createdAt,
            questions: quiz.questions.map(({ question, options }) => ({ question, options })),
        };

        res.status(200).json(sanitized);
    } catch (error) {
        console.error("Error fetching quiz:", error);
        res.status(500).json({ message: "Failed to fetch quiz" });
    }
};

// Get Active Quizzes for a Group (isActive: true only)
export const getGroupQuizzes = async (req: Request, res: Response) => {
    try {
        const { groupId } = req.params;
        const quizzes = await Quiz.find({ group: groupId, isActive: true })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate("createdBy", "name avatar");
        res.status(200).json(quizzes);
    } catch (error) {
        console.error("Error fetching group quizzes:", error);
        res.status(500).json({ message: "Failed to fetch quizzes" });
    }
};
