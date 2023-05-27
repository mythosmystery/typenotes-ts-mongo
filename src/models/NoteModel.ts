import { ObjectType, Field, ID } from 'type-graphql'
import type { Document as MDoc } from 'mongodb'

@ObjectType()
export class Note implements MDoc {
  @Field(type => ID)
  _id: string

  @Field()
  title: string

  @Field()
  body: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
