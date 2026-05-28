import { Request, Response, NextFunction } from "express";

export class serverError extends Error {
  private _status: number = 500;

  constructor(message: string, statusCode?: number) {
    super(message); 
    if (statusCode) {
      this._status = statusCode;
    }
    Object.setPrototypeOf(this, new.target.prototype); 
  }

  get statusCode(): number {
    return this._status;
  }

  set statusCode(code: number) {
    this._status = code;
  }
}

export const errorHandler = (
  err: any, 
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const code: number = err.statusCode || 500;
  
  const message: string = err.message || "Internal server error!";

  const body = {
    error: {
      message: message,
      code: code
    }
  };
  console.error(err);
  res.status(code).json(body);
};