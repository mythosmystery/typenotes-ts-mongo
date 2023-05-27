import { ObjectType, Field, ID } from 'type-graphql'
import type { Document as MDoc } from 'mongodb'

@ObjectType()
export class Recipe implements MDoc {
  @Field(type => ID)
  _id: string

  @Field()
  title: string

  @Field({ nullable: true })
  description?: string
}
