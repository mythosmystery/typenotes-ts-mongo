import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import resolvers from './resolvers'
import { startDB } from './db'
import express from 'express'
import { expressjwt as jwt } from 'express-jwt'
import { ApolloContext, Context } from './types'
import { customAuthChecker } from './auth/authChecker'

const app = express()
const path = '/gql'

async function main() {
  await startDB()
  const schema = await buildSchema({
    resolvers: [...resolvers] as any,
    authChecker: customAuthChecker
  })

  const server = new ApolloServer({
    schema,
    context: ({ req, res }: ApolloContext): Context => {
      const user = req.auth || null
      return { req, res, user }
    }
  })

  app.use(
    path,
    jwt({
      credentialsRequired: false,
      secret: 'sdofjhsodfijoaidjfoaisjdoiajsd',
      algorithms: ['HS256']
    })
  )

  await server.start()
  // Apply the GraphQL server middleware
  server.applyMiddleware({ app, path })

  // Launch the express server
  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  )
}

main()
