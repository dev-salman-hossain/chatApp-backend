import { NextFunction, Request, Response } from 'express';
import { ZodTypeAny } from 'zod';

const validateRequest = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const schemaShape = (schema as any)?.shape;
      if (schemaShape && (schemaShape.body || schemaShape.query || schemaShape.params || schemaShape.cookies)) {
        await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
          cookies: req.cookies,
        });
      } else {
        await schema.parseAsync(req.body);
      }
      return next();
    } catch (error) {
      return next(error);
    }
  };
};

export default validateRequest;
