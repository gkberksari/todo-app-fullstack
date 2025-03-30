import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types/index.js';

export const errorHandler = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  console.error('Error:', err);
  
  const errorResponse: ErrorResponse = {
    error: 'Internal Server Error',
    details: process.env.NODE_ENV === 'production' ? undefined : err.message
  };
  
  res.status(500).json(errorResponse);
};