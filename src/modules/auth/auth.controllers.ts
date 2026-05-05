import {CreateAuthSchema, CredentialsSchema, UpdateUserSchema} from "@modules/auth/auth.type";
import {Request, Response} from "express";
import {AuthServices} from "@modules/auth/auth.services";
import {UserType} from "@database/generated/prisma/client";
import {NotTokenProvidedOrInvalid} from "@utils/errors/app-error";

export async function register(req: Request, res: Response) {
    const {name, email, password, phone} = CreateAuthSchema.parse(req.body);

    await AuthServices.createUser(name, email, password, phone ?? '', '', UserType.worker)

    res.status(201).json({message: 'User registered successfully'})
}

export async function login(req: Request, res: Response) {
    const {email, password} = CredentialsSchema.parse(req.body);

    const user = await AuthServices.getUserByCredentials(email, password);
    if (!user) return res.status(401).json({message: 'Invalid credentials'});

    const token = await AuthServices.generateToken(user);

    return res.status(200).json({message: 'Login successful', token})
}

export async function me(req: Request, res: Response) {
    const user = req.session?.user;

    if (!user) return res.status(401).json({message: 'Unauthorized'});

    const [name, email, phone, type, avatar, createdAt] = await Promise.all([
        user.name,
        user.email,
        user.phone,
        user.type,
        user.avatarUrl,
        user.createdAt,
    ]);

    return res.status(200).json({
        name,
        email,
        phone,
        type,
        avatar,
        createdAt,
    });
}

export async function updateMe(req: Request, res: Response) {
    const user = req.session?.user;
    if (!user) return res.status(401).json({message: 'Unauthorized'});

    const {currentPassword, newData: {name, email, phone, password}} = UpdateUserSchema.parse(req.body);

    if (await AuthServices.getUserByCredentials(user.email, currentPassword) === null) throw new NotTokenProvidedOrInvalid();

    await AuthServices.updateUser(user.id, name, email, phone, password);
    return res.status(200).json({message: 'User updated successfully'});
}