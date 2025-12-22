import { Router, Request, Response, NextFunction } from "express";
import { serverError } from "../middleware/errorHandler";
const articulos = Router();

articulos.get(
  "/",
  async (

    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    res.send("success")
  }
);

articulos.get(
  "/resto",
  async (

    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("resto");
      res.send("ok").status(400);
    } catch (err) {
      next(err);
    }
  }
);

export { articulos };
