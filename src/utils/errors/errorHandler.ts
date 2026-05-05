import {ErrorRequestHandler} from "express";
import {AppError} from "@utils/errors/app-error";


const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.log(err);
    
    if (err instanceof AppError) {
        let message;

        try {
            message = JSON.parse(err.message);
        } catch (e) {
            message = err.message;
        }

        return res.status(err.statusCode).send({
            message: message,
        });
    }

    res.status(500).json({message: err.message || "Internal server error"});
};

export default errorHandler;