import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.js";
export declare const createQuiz: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const submitScore: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getLeaderboard: (req: Request, res: Response) => Promise<void>;
export declare const endQuiz: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=quizController.d.ts.map