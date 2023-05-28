import { ObjectType, Field, ID } from 'type-graphql'
import type { Document as MDoc } from 'mongodb'
import { User } from './UserModel'

@ObjectType()
export class Auth implements MDoc {
  @Field(type => User)
  user: User

  @Field()
  accessToken: string

  @Field()
  refreshToken: string
}
