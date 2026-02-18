import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middleware/auth.js";
export declare function getMessages(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=messageController.d.ts.map