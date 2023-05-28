import { ObjectType, Field, ID } from 'type-graphql'
import type { Document as MDoc, ObjectId } from 'mongodb'
import { User } from './UserModel'

@ObjectType()
export class Note implements MDoc {
  @Field(type => ID)
  _id?: ObjectId

  @Field()
  title: string

  @Field()
  body: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field(type => User)
  createdBy: ObjectId | User
}
