import {User} from "@database/generated/prisma/client";
import {prisma} from '@database/client';

/**
 * Class representing a "lazy-loaded" user for Prisma.
 * Defers database fetching until a non-indexed property or method is accessed.
 */
export class LazyUser {
    private readonly _userId: string;
    private _email: string | null;
    private _userInstance: User | null = null; // Cached user instance

    constructor(userId: string, email: string | null = null) {
        this._userId = userId;
        this._email = email;
    }

    /**
     * Fetches the full user document from Prisma.
     */
    private async _loadUser(): Promise<User> {
        if (!this._userInstance) {
            this._userInstance = (await prisma.user.findUnique({
                where: {id: this._userId},
            })) as User;

            if (!this._userInstance) {
                throw new Error(`User with id ${this._userId} not found`);
            }
        }
        return this._userInstance;
    }

    /**
     * Accesses a property from the loaded user.
     */
    private async _getProperty<K extends keyof User>(
        property: K
    ): Promise<User[K]> {
        const userInstance = await this._loadUser();
        return userInstance[property];
    }

    /**
     * Creates a Proxy that intercepts access to properties.
     * If accessing id or email, it returns immediately.
     */
    public static createProxy(userId: string, email: string | null = null): User {
        const lazyUser = new LazyUser(userId, email);

        return new Proxy(lazyUser, {
            get: (target, prop: string | symbol) => {
                if (prop === 'id') return userId;
                if (prop === 'email' && email !== null) return email;

                if (prop === 'then') return undefined;

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const targetProp = (target as any)[prop];
                if (typeof targetProp === 'function') return targetProp.bind(target);

                return target._getProperty(prop as keyof User);
            },
        }) as unknown as User;
    }
}

export default class Session {
    constructor(
        public user: User,
        // private _companyId?: string,
        // private _role?: AppRole
    ) {
    }

    public static createSession(payload: {
        userId: string;
        email: string;
        // sessionData?: {
        //     companyId: string;
        //     role: AppRole;
        // };
    }): Session {
        return new Session(
            LazyUser.createProxy(payload.userId, payload.email),
            // payload.sessionData?.companyId,
            // payload.sessionData?.role
        );
    }

    // get companyId(): string | null {
    //     return this._companyId ?? null;
    // }

    // get role(): AppRole | null {
    //     return this._role ?? null;
    // }
}