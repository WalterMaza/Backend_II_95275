
//admitir organizer o admin

export const authorizeRoles = (...roles) => {

    return (req, res, next) => {
        
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                status: "error",
                "message": "No tiene permisos para acceder a este recurso"
            })
        }

        next();
    }
}