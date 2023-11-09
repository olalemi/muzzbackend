import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../utils/customErrors';
import dotenv from 'dotenv';

dotenv.config();

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const response =
    err instanceof CustomError
      ? err.toJSON()
      : { code: 500, status: 'error', message: err.message };

  return res.status(statusCode).json(response);
};
