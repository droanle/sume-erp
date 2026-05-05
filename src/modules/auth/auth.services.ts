import {prisma} from "@database/client";
import {AppError} from "@utils/errors/app-error";
import bcrypt from 'bcryptjs';
import {UserType} from "@database/generated/prisma/client";

export class AuthServices {
    public static async createUser(name: string, email: string, password: string, phone: string, avatarUrl: string = '', type: string) {
        const userExists = await prisma.user.findUnique({
            where: {email},
        });

        if (userExists) throw new AppError('Email already in use', 422);

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                passwordHash,
                phone,
                avatarUrl,
                type: type as UserType,
            },
        });

        if (!user) throw new AppError('Error creating user.');

        return 0;
    }
}