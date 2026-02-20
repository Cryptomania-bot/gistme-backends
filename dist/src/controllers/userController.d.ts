import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middleware/auth.js";
export declare function getUsers(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function updateMe(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=userController.d.ts.map