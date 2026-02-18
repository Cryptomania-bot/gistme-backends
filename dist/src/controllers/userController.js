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
//# sourceMappingURL=userController.js.map