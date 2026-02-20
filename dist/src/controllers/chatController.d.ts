import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middleware/auth.js";
export declare function getChats(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function getOrCreateChat(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function getChatById(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=chatController.d.ts.map