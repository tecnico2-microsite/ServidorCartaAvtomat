import { Router, Request, Response, NextFunction } from "express";
import { serverError } from "../middleware/errorHandler";
import { getArticulos } from "../services/articulosServices";
const articulos = Router();

articulos.get("/", async (req: Request, res: Response, next: NextFunction) => {
  res.send("success");
});

articulos.get(
  "/resto",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const raw = req.query.raw === "true";
      console.log("resto");
      const response = await getArticulos("RESTO", raw);
      res.json(response).status(400);
    } catch (err) {
      next(err);
    }
  }
);

export { articulos };
