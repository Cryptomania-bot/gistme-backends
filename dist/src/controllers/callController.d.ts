import type { AuthRequest } from "../middleware/auth.js";
import type { Response } from "express";
export declare const logCall: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getRecentCalls: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=callController.d.ts.map