import type { AuthRequest } from "../middleware/auth.js";
import type { Response } from "express";
export declare const createStory: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getActiveStories: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=storyController.d.ts.map