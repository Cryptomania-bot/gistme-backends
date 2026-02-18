import type { AuthRequest } from "../middleware/auth.js";
import type { Request, Response, NextFunction } from "express";
export declare function getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function authCallback(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=authController.d.ts.map