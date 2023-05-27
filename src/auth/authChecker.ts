import { AuthChecker } from 'type-graphql'
import { Context } from '../types'

export const customAuthChecker: AuthChecker<Context> = ({
  root,
  args,
  context,
  info
}) => {
  return !!context.user
}
