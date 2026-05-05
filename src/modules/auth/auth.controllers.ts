import {CreateAuthSchema} from "@modules/auth/auth.type";
import {Request, Response} from "express";
import {AuthServices} from "@modules/auth/auth.services";
import {UserType} from "@database/generated/prisma/enums";

export async function register(req: Request, res: Response) {
    const {name, email, password, phone} = CreateAuthSchema.parse(req.body);

    const user = await AuthServices.createUser(name, email, password, phone ?? '', '', UserType.worker)

    res.status(201).json({message: 'User registered successfully'})
}