import fs from 'fs';
import path from 'path';
import {prisma} from "@database/client";
import {AppError} from "@utils/errors/app-error";
import bcrypt from 'bcryptjs';
import {User, UserType} from "@database/generated/prisma/client";
import * as jose from 'jose';

// Load the private key for JWT signing
const privateKeyPath = path.join(process.cwd(), 'certs', 'private.pem');
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

export class AuthServices {
    public static async createUser(name: string, email: string, password: string, phone: string, avatarUrl: string = '', type: string) {
        const userExists = await prisma.user.findUnique({
            where: {email},
        });

        if (userExists) throw new AppError('Email already in use', 422);

        const passwordHash = await bcrypt.hash(password.trim(), 10);

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

    public static async updateUser(userId: string, name?: string, email?: string, phone?: string, password?: string) {
        let data: any = {
            name,
            email,
            phone,
            ...(password && {passwordHash: await bcrypt.hash(password.trim(), 10)}),
        }

        data = Object.fromEntries(
            Object
                .entries(data)
                .filter(([_, value]) => value !== undefined && value !== null)
        );

        return await prisma.user.update({where: {id: userId}, data});
    }

    public static async getUserByCredentials(email: string, password: string): Promise<User | null> {
        const user = await prisma.user.findUnique({where: {email}});
        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(password.trim(), user.passwordHash);
        if (!isPasswordValid) return null;

        return user;
    }

    public static async generateToken(user: User): Promise<string> {
        const alg = 'RS256';
        const pk = await jose.importPKCS8(privateKey, alg);

        return await new jose.SignJWT({email: user.email})
            .setProtectedHeader({alg})
            .setIssuedAt(new Date())
            .setIssuer('sume-erp:api')
            .setAudience(process.env.SUME_ERP_CLIENT_AUDIENCE || 'sume-erp:client')
            .setExpirationTime(process.env.TOKEN_EXPIRATION_TIME || '8h') // Token valid for 8 hours by default.
            .setSubject(user.id)
            .sign(pk);
    }
}