import 'dotenv/config';
import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from './generated/prisma/client'; // Importe apenas o Client
import {ModelName} from './generated/prisma/internal/prismaNamespace';

type ModelConfig = {
    field: string;
};

type ConfigModels = Partial<Record<ModelName, ModelConfig | boolean>>;

let adapter;
const databaseUrl =
    process.env.DATABASE_URL || process.env.TEST_DATABASE_URL || '';

// if (databaseUrl && databaseUrl.startsWith('file:')) {
//   // Use SQLite adapter when DATABASE_URL points to a file
//   adapter = new PrismaBetterSqlite3({
//     url: databaseUrl,
//   });
// } else {
// Default to Postgres adapter and use DATABASE_URL
adapter = new PrismaPg({
    connectionString: databaseUrl || process.env.DATABASE_URL || '',
});
// }

const basePrisma = new PrismaClient({adapter});

const prisma = basePrisma.$extends({
    name: 'soft-delete',
    query: {
        $allModels: {
            async delete({model, args, query}) {
                const prismaModel = model.charAt(0).toLowerCase() + model.slice(1);
                if (!(basePrisma as any)[prismaModel].fields.some((f: any) => f.name === 'deletedAt')) return query(args);

                return (basePrisma as any)[prismaModel].update({
                    ...args,
                    data: {
                        deletedAt: new Date(),
                    },
                });
            },
            async deleteMany({model, args, query}) {
                const prismaModel = model.charAt(0).toLowerCase() + model.slice(1);
                if (!(basePrisma as any)[prismaModel].fields.some((f: any) => f.name === 'deletedAt')) return query(args);

                return (basePrisma as any)[prismaModel].updateMany({
                    ...args,
                    data: {
                        deletedAt: new Date(),
                    },
                });
            },
        },
    },
});

export {prisma};
