import { ObjectType, Field, ID } from 'type-graphql'
import type { Document as MDoc, ObjectId } from 'mongodb'
import { Note } from './NoteModel'

@ObjectType()
export class User implements MDoc {
  @Field(type => ID)
  _id?: ObjectId

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
