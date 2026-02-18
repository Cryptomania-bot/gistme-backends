import type { Request, Response, NextFunction } from 'express';
export type AuthRequest = Request & {
    userId?: string;
};
export declare const protectRoute: (import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | ((req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>))[];
//# sourceMappingURL=auth.d.ts.map