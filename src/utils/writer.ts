import fs from 'fs'
import { serverError } from '../middleware/errorHandler'


const writeFile = (path:string,data:JSON) => {
    try{
        
    }catch(err){
        console.error(err)
        throw new serverError("Error al escribir el archivo")
    }

}