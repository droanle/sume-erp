import {z} from "zod";

export const CreateAuthSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(4),
    phone: z.string().max(11).regex(/^\d+$/, "Phone number must contain only digits").optional(),
});

export const UpdateUserSchema = z.object({
    currentPassword: z.string(),
    newData: CreateAuthSchema.partial(),
});

export const CredentialsSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});


