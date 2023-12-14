import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { HttpClient } from "../network/httpClient";

const requiresAuth: RequestHandler = async (req, res, next) => {
    try {
        const getAuth = await new HttpClient().sendRequest("/me", {
            method: "get",
            headers: {
                Cookie: req.headers.cookie
            }
        });

        req.user = getAuth.data;

        next();
    } catch (error) {
        next(createHttpError(401, "User not authenticated"));
    }
}

export default requiresAuth;