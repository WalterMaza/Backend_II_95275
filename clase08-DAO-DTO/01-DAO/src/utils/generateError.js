export const generateError=(message, statusCode=400, module=null)=>{
    let error=new Error(message)
    error.statusCode=statusCode
    error.module=module

    return error
}