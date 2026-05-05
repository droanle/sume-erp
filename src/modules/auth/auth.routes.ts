import {GroupingProvider} from "gatex-express";
import {CreateAuthSchema, CredentialsSchema, UpdateUserSchema} from "@modules/auth/auth.type";
import {register, login, me, updateMe} from "@modules/auth/auth.controllers";
import {authMiddleware} from "@/middlewares/auth.middleware";

export default function (GP: GroupingProvider) {
    GP.post('/register', {body: CreateAuthSchema}, register);
    GP.post('/login', {body: CredentialsSchema}, login);

    GP.get('/me', authMiddleware, me);
    GP.put('/me', {body: UpdateUserSchema}, authMiddleware, updateMe);
}
