import  PERMISSIONS from "../config/permissions.config.js";

export const checkPermission=(permission)=>{
    return (req, res, next)=>{
        const userRole = req.role || req.user?.accountType || 'guest';
        const allowed = PERMISSIONS[userRole] || [];
        if(!allowed.includes(permission)){
            return res.status(403).json({message: 'Access denied insuffient permissions'});
        }
        next();
    };
};
