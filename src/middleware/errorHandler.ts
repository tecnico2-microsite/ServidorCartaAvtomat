import { Request, Response, NextFunction } from "express";

export class serverError extends Error {
  private _status: number = 500;

  get statusCode(): number {
    return this._status;
  }

  set statusCode(code: number) {
    this._status = code;
  }
}

export const errorHandler = (
  err: serverError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
  let message: string = "Internal server error!";
  let code: number = 500;
  if (err.statusCode == 404) {
    message = "Not found!";
    code = 404;
  }
  const body : string = `{error:{message:${message}, code:${code}}}`
  res.json(body).status(code)
  console.error(err);
};
