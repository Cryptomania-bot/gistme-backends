import type { Request, Response } from "express";
export declare const createGroup: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const joinGroup: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const generateInviteCode: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateGroupSettings: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=groupController.d.ts.map