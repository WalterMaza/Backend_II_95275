export const errorHandler=(error, req, res, next)=>{


    res.setHeader('Content-Type','application/json');
    return res.status(error.statusCode?error.statusCode:500).json({error:`Error: ${error.message}`, origen: error.statusCode?error.origen:undefined})
}