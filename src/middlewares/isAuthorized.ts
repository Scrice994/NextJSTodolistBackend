import { RequestHandler } from "express";
import createHttpError from "http-errors";

export const isAuthorized: RequestHandler = (req, res, next) => {
    if(req.user?.userRole === "Admin"){
        return next();
    }
    next(createHttpError(403, "You are not authorized"));
}