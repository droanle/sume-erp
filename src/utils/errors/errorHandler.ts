import {ErrorRequestHandler} from "express";
import {AppError} from "@utils/errors/app-error";


const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        let message;

        try {
            message = JSON.parse(err.message);
        } catch (e) {
            message = err.message;
        }

        return res.status(err.statusCode).send({
            statusCode: err.statusCode || "Internal server error",
            message: message,
        });
    }

    res.status(500).json({message: err.message || "Internal server error"});
};

export default errorHandler;