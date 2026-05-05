import {AuthGuard} from '@utils/auth.guard';
import {NotTokenProvidedOrInvalid, UnauthorizedError} from '@utils/errors/app-error';
import {NextFunction, Request, Response} from "express";
import Session from "@utils/types/session.types";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new NotTokenProvidedOrInvalid();

    const token = authHeader.replace('Bearer ', '');

    const decoded = await AuthGuard.verify(token);
    if (!decoded) throw new UnauthorizedError();

    req.session = Session.createSession(decoded as any);

    next();
}
