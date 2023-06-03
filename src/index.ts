import dotenv from 'dotenv'
dotenv.config()
import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import resolvers from './resolvers'
import { startDB } from './db'
import express from 'express'
import { Request } from 'express-jwt'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { ApolloContext, Context, TokenUser } from './types'
import { customAuthChecker } from './auth/authChecker'
import { decodeToken } from './auth/authUtils'
import { authMiddleware } from './auth/authMiddleware'
import { ErrorInterceptor } from './middleware/errorLog'
import { LogEvent } from './middleware'

const app = express()
const path = '/gql'

async function main() {
  await startDB()
  const schema = await buildSchema({
    resolvers: [...resolvers] as any,
    authChecker: customAuthChecker,
    globalMiddlewares: [ErrorInterceptor]
  })

  const server = new ApolloServer({
    schema,
    context: ({ req, res }: ApolloContext): Context => {
      const user = req.auth || null
      if (req.body.operationName === `IntrospectionQuery`)
        return { req, res, user }

      LogEvent({
        ...req.body,
        user
      })
      return { req, res, user }
    }
  })

  app.use(path, authMiddleware)

  await server.start()
  // Apply the GraphQL server middleware
  server.applyMiddleware({ app, path })

  // Launch the express server
  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  )
}

main()
