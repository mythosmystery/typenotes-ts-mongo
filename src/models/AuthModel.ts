import { ObjectType, Field, ID, InputType } from 'type-graphql'
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

@InputType()
export class LoginInput implements Partial<User> {
  @Field()
  email: string

  @Field()
  password: string
}

@InputType()
export class RegisterInput implements Partial<User> {
  @Field()
  email: string

  @Field()
  fullName: string

  @Field()
  username: string

  @Field()
  password: string
}
