import { Request, Response, NextFunction } from "express";

const requireRole = (req: Request, res: Response, next: NextFunction) => {

    if (req.user.role === "user") {
        return res.status(403).json({
        error: "Broken access control",
        message: "You do not have permission to access this resource"
        });
    }

    next();
};


export default requireRole;