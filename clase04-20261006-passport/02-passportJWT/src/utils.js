import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from "bcrypt"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;


export const generaHash=async(password)=>{
    return await bcrypt.hash(password, 10)
}

export const validaPass=async(password, hash)=>{
    return await bcrypt.compare(password, hash)
}

export const generateError=(message, origen=undefined, statusCode=400)=>{
    let error=new Error(message)
    error.statusCode=statusCode
    error.origen=origen

    return error
}