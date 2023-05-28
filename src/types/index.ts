import { Response } from 'express'
import { Request } from 'express-jwt'

export type TokenUser = {
  _id: string
  email: string
  iat?: number
  exp?: number
}

export interface ApolloContext {
  req: Request<{ _id: string; email: string }>
  res: Response
}

export interface Context extends ApolloContext {
  user: TokenUser | null
}
