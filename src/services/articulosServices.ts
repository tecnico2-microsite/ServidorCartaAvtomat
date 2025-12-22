import { getPool } from "../config/connection";
import { serverError } from "../middleware/errorHandler";
import {VarChar} from "mssql"
import { parseMenuData } from "../utils/parser";
type posibles = "RESTO" | "BAR"


export const getArticulos = async (visualizacion : posibles,raw:boolean =false) : Promise<any> => {
    try{
    const pool = await getPool()
    const resultDB = await pool.request().input("vis",VarChar,visualizacion).query("SELECT A.REFPROVEEDOR, P.PBRUTO AS PRECIO_PVP1, M.CODMARCA ,M.DESCRIPCION AS MDESC, L.CODLINEA, L.DESCRIPCION, CL.TITULO_WEB, CL.DESCRIPCION_WEB, CL.OBSERVACION_WEB, CL.NO_PUBLICAR_PRECIO, CL.CARTA_WEB AS VISUALIZACION FROM [dbo].[ARTICULOS] A INNER JOIN [dbo].[ARTICULOSCAMPOSLIBRES] CL ON A.CODARTICULO = CL.CODARTICULO INNER JOIN [dbo].[PRECIOSVENTA] P ON A.CODARTICULO = P.CODARTICULO INNER JOIN [dbo].[LINEA] L ON A.LINEA = L.CODLINEA INNER JOIN [dbo].[MARCA] M ON A.MARCA = M.CODMARCA WHERE CL.CARTA_WEB IN ('AMBOS', @vis) AND P.IDTARIFAV = 1 ORDER BY PRECIO_PVP1 ASC;")
    if (raw) return resultDB.recordset
    const result = parseMenuData(resultDB.recordset)
    //console.log(JSON.stringify(result,null,2))
    
    return result
    
    }
    catch(err){
        console.log(err)
        throw new serverError("error sql!")
    }

}

