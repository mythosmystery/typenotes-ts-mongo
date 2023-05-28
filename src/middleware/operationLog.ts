import { MiddlewareFn } from 'type-graphql'
import { Context, TokenUser } from '../types'

export interface LogItem {
  operationName: string
  variables: Record<string, any>
  query: string
  user: TokenUser | null
}

export const LogEvent = (item: LogItem) => {
  console.log({ ...item, time: new Date() })
}
