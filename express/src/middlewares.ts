import { Request, Response, NextFunction } from 'express';
import z, { ZodType } from 'zod';

export const validate = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body against schema
    const result = schema.safeParse(req.body);

    // If validation fails, return 400 with detailed errors
    if (!result.success) {
      const formatted = result.error.format();
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: formatted
      });
    }

    // Validation passed - replace req.body with validated data
    req.body = result.data;
    return next();
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal validation error'
    });
  }
};

export const validateParams = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request params against schema
    const result = schema.safeParse(req.params);
    // If validation fails, return 400 with detailed errors
    if (!result.success) {
      return res.status(400).json({
        error: 'Invalid request parameters',
        details: z.prettifyError(result.error)
      });
    }
    // Validation passed - replace req.params with validated data
    req.params = result.data as any;
    return next();
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal parameter validation error'
    });
  }
};