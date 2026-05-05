import fs from 'fs';
import path from 'path';
import * as jose from 'jose';

const publicKeyPath = path.join(process.cwd(), 'certs', 'public.pem');
const publicKeyStr = fs.readFileSync(publicKeyPath, 'utf8');

export class AuthGuard {
    static async verify(token?: string): Promise<{
        userId: string;
        email?: string;
    } | null> {
        if (!token) return null;

        try {
            const alg = 'RS256';
            const spki = await jose.importSPKI(publicKeyStr, alg);

            const {payload} = await jose.jwtVerify(token, spki, {
                issuer: 'sume-erp:api',
                audience: process.env.SUME_ERP_CLIENT_AUDIENCE || 'sume-erp:client',
            });

            const userId = payload.sub;
            if (!userId) return null;

            let response: any = {userId};

            if (payload.email) response.email = payload.email;
            // if (payload.sessionData) response.sessionData = payload.sessionData;

            return response;
        } catch (error) {
            return null;
        }
    }
}
