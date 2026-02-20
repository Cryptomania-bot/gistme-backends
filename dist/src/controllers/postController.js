import { Post } from "../models/Post.js";
// Create a new post
export const createPost = async (req, res) => {
    try {
        const { text, mediaUrl, type } = req.body;
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const post = await Post.create({
            user: userId,
            text,
            mediaUrl,
            type: type || 'text'
        });
        const populatedPost = await post.populate("user", "name avatar");
        res.status(201).json(populatedPost);
    }
    catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Failed to create post" });
    }
};
// Get feed posts with pagination
export const getPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const [posts, totalPosts] = await Promise.all([
            Post.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("user", "name avatar")
                .populate("comments.user", "name avatar"),
            Post.countDocuments()
        ]);
        const totalPages = Math.ceil(totalPosts / limit);
        res.status(200).json({
            posts,
            currentPage: page,
            totalPages,
            totalPosts,
            hasMore: page < totalPages
        });
    }
    catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Failed to fetch posts" });
    }
};
// Like/Unlike a post (Atomic)
export const toggleLike = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const post = await Post.findById(id);
        if (!post)
            return res.status(404).json({ message: "Post not found" });
        const isLiked = post.likes.includes(userId);
        let updatedPost;
        if (isLiked) {
            // Unlike: just remove from likes
            updatedPost = await Post.findByIdAndUpdate(id, { $pull: { likes: userId } }, { new: true });
        }
        else {
            // Like: add to likes, remove from dislikes
            updatedPost = await Post.findByIdAndUpdate(id, {
                $addToSet: { likes: userId },
                $pull: { dislikes: userId }
            }, { new: true });
        }
        res.status(200).json(updatedPost);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to toggle like" });
    }
};
// Dislike/Undislike a post (Atomic)
export const toggleDislike = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const post = await Post.findById(id);
        if (!post)
            return res.status(404).json({ message: "Post not found" });
        const isDisliked = post.dislikes.includes(userId);
        let updatedPost;
        if (isDisliked) {
            // Undislike: just remove from dislikes
            updatedPost = await Post.findByIdAndUpdate(id, { $pull: { dislikes: userId } }, { new: true });
        }
        else {
            // Dislike: add to dislikes, remove from likes
            updatedPost = await Post.findByIdAndUpdate(id, {
                $addToSet: { dislikes: userId },
                $pull: { likes: userId }
            }, { new: true });
        }
        res.status(200).json(updatedPost);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to toggle dislike" });
    }
};
// Add a comment
export const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const userId = req.userId;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        if (!text)
            return res.status(400).json({ message: "Comment text is required" });
        const post = await Post.findById(id);
        if (!post)
            return res.status(404).json({ message: "Post not found" });
        post.comments.push({
            user: userId,
            text,
            createdAt: new Date()
        });
        await post.save();
        const populatedPost = await post.populate("comments.user", "name avatar");
        res.status(200).json(populatedPost);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to add comment" });
    }
};
//# sourceMappingURL=postController.js.map