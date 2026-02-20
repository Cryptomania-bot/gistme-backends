import type { AuthRequest } from "../middleware/auth.js";
import type { Response } from "express";
export declare const createPost: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getPosts: (req: AuthRequest, res: Response) => Promise<void>;
export declare const toggleLike: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const toggleDislike: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const addComment: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=postController.d.ts.map