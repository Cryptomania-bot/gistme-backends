import { User } from "../models/User.js";
export async function getUsers(req, res, next) {
    try {
        const userId = req.userId;
        const { search } = req.query;
        let query = { _id: { $ne: userId } };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        const users = await User.find(query).select("name email avatar").limit(50);
        res.json(users);
    }
    catch (error) {
        res.status(500);
        next(error);
    }
}
export async function updateMe(req, res, next) {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { name, avatar } = req.body;
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (avatar !== undefined)
            updateData.avatar = avatar;
        const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true }).select("-clerkId"); // Exclude clerkId from response
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(updatedUser);
    }
    catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500);
        next(error);
    }
}
//# sourceMappingURL=userController.js.map