import { ErrorRequestHandler } from "express";
import { isHttpError } from "http-errors";

// ci serve il disable perchè non possiamo rimuovere parametro next dalla funzione se no non lo riconosce come errorHandler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    console.log(error);
    let statusCode = 500;
    let errorMessage = "An unknown error occurred";
    if(isHttpError(error)){
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage })
}

export default errorHandler;