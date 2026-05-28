import { getPool } from "../config/connection";
import { serverError } from "../middleware/errorHandler";
import { VarChar } from "mssql";
import { parseMenuData } from "../utils/parser";
import { writer } from "../utils/writer";

type posibles = "RESTO" | "BAR";

export const getArticulos = async (
  visualizacion: string,
  raw: boolean = false,
  inicio: string,
  fin: string,
): Promise<any> => {
  try {
    const pool = await getPool();
    const preparedVis = prepareVis(visualizacion.split(","))
    

    const resultDB = await pool
      .request()
      .input("inicio", VarChar, inicio)
      .input("fin", VarChar, fin)
      .query(
        `SELECT A.REFPROVEEDOR, P.PBRUTO AS PRECIO_PVP1, M.CODMARCA ,M.DESCRIPCION AS MDESC, L.CODLINEA, L.DESCRIPCION, CL.TITULO_WEB, CL.DESCRIPCION_WEB, CL.OBSERVACION_WEB, CL.NO_PUBLICAR_PRECIO FROM [dbo].[ARTICULOS] A INNER JOIN [dbo].[ARTICULOSCAMPOSLIBRES] CL ON A.CODARTICULO = CL.CODARTICULO INNER JOIN [dbo].[PRECIOSVENTA] P ON A.CODARTICULO = P.CODARTICULO INNER JOIN [dbo].[LINEA] L ON A.LINEA = L.CODLINEA INNER JOIN [dbo].[MARCA] M ON A.MARCA = M.CODMARCA WHERE ${preparedVis} AND P.IDTARIFAV = 1 AND A.DESCATALOGADO = 'F'AND A.REFPROVEEDOR BETWEEN @inicio AND @fin ORDER BY PRECIO_PVP1 ASC;`,
      );
    if (raw) return resultDB.recordset;
    const result = parseMenuData(resultDB.recordset);
    //console.log(JSON.stringify(result,null,2))

    return result;
  } catch (err) {
    console.log(err);
    throw new serverError("error sql!");
  }
};

export const writeArticulos = async (
  visualizacion: string,
  fullPath: string,
  raw: boolean = false,
  inicio: string,
  fin: string,
) => {
  try {
    const data = await getArticulos(visualizacion, raw, inicio, fin);
    if (raw) {
      return data;
    }

    writer(fullPath, data);
    return "Success!";
  } catch (err) {
    console.log(err);
    throw new serverError("error sql!");
  }
};

export const prepareVis = (visualizaciones: string[]) => {
  if (visualizaciones.length == 0)
    throw new serverError("No hay visualizacion especificada");

  let concatenated: string = "";
  let caracter = " OR ";
  const largo = visualizaciones.length;
  for (let i = 0; i < largo; i++) {
    let element: string = String(visualizaciones[i]);
    let accepted = /^CARTA_[A-Za-z0-9_]+$/.test(element)

    if (!accepted){
      throw new serverError("Caracter ilegal en visualizaciones");
    }
    if (i==largo-1) caracter=""

    concatenated += `CL.${element}='T'${caracter}`;

  }

  return concatenated;
};
