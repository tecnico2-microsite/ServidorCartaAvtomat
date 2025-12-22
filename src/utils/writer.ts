import fs from 'fs'
import { serverError } from '../middleware/errorHandler'


export const writer = (path:string,data:JSON) => {
    try{
        const dataString = JSON.stringify(data,null,2)
        fs.writeFileSync(path,dataString,'utf-8')
    }catch(err){
        console.error(err)
        throw new serverError("Error al escribir el archivo")
    }

}