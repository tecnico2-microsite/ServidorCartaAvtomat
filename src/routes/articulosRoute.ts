import { Router, Request, Response, NextFunction } from "express";
import { serverError } from "../middleware/errorHandler";
import { writeArticulos } from "../services/articulosServices";

const articulos = Router();
type posibles = "RESTO" | "BAR";
const valores_posibles = ["RESTO", "BAR"];
/*
articulos.get("/", async (req: Request, res: Response, next: NextFunction) => {
  res.send("success");
});
*/
articulos.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const raw = req.query.raw === "true";
    const fullPath = req.query.fullPath as string;
    const reqVis = req.query.visualizacion; //console.log("resto");
    let inicio = req.query.inicio?.toString();
    let fin = req.query.fin?.toString();

    if (!reqVis) throw new serverError("No hay visualizacion especificada");

    if (!inicio) {
      inicio = "0000";
    }
    if (!fin) {
      fin = "9999";
    }

    if (fin < inicio) {
      throw new serverError("Los datos de filtro son incorrectos");
    }

    if (
      !valores_posibles.includes(reqVis.toString()) ||
      typeof reqVis != "string"
    )
      throw new serverError("");

    const visualizacion: posibles = reqVis as posibles;

    if (!fullPath.endsWith(".json")) throw new serverError("Error al escribir");

    //console.log("hola" + fullPath);
    const response = await writeArticulos(
      visualizacion,
      fullPath,
      raw,
      inicio,
      fin,
    );
    res.json(response).status(400);
  } catch (err) {
    next(err);
  }
});

export { articulos };
