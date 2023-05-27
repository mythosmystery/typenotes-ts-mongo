import { ObjectType, Field, ID } from 'type-graphql'
import type { Document as MDoc } from 'mongodb'
import { Note } from './NoteModel'

@ObjectType()
export class User implements MDoc {
  @Field(type => ID)
  _id: string

  @Field()
  email: string

  @Field()
  fullName: string

  @Field()
  username: string

  @Field()
  password: string

  @Field(type => [Note])
  notes: Note[]

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
