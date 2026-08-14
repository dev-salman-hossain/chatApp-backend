import { NextFunction, Request, Response } from 'express';
import { ZodTypeAny } from 'zod';
declare const validateRequest: (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default validateRequest;
//# sourceMappingURL=validateRequest.d.ts.map