import 'reflect-metadata'
import dotenv from 'dotenv';
import "./graphql/registers/typeEnum.register";
import express from 'express'
import cors from 'cors'
import { ApolloServer } from '@apollo/server'
import { buildSchema } from 'type-graphql'
import { expressMiddleware } from '@as-integrations/express5'
import { AuthResolver } from './resolvers/auth.resolver'
import { UserResolver } from './resolvers/user.resolver'
import { buildContext } from './graphql/context'
import { CategoryResolver } from './resolvers/category.resolver'
import { TransactionResolver } from './resolvers/transaction.resolver'

async function main() {
    const app = express()

    dotenv.config();

    app.use(
        cors({
            origin: [process.env.FRONTEND_URL, "https://studio.apollographql.com"],
            credentials: true,
        })
    )

    const schema = await buildSchema({
        resolvers: [AuthResolver, UserResolver, CategoryResolver, TransactionResolver],
        validate: false,
        emitSchemaFile: './schema.graphql'
    })

    const server = new ApolloServer({
        schema
    })

    await server.start()

    app.use(
        '/graphql',
        express.json(),
        expressMiddleware(server, {
            context: buildContext,
        })
    )

    app.listen({
        port: 4000
    }, () => {
        console.log('Servidor iniciado na porta 4000!');
    })
}

main()