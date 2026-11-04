export const errorHandler=(error, req, res, next)=>{
    console.log(error)

    res.setHeader('Content-Type','application/json');
    return res.status(error.statusCode?error.statusCode:500).json({error:`${error.statusCode?error.message:"Internal Server Error"}`})
}

