import { ObjectType, Field, ID } from 'type-graphql'
import type { Document as MDoc, ObjectId } from 'mongodb'
import { Note } from './NoteModel'
import bcrypt from 'bcrypt'
import { UserInput } from '../services'

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

  constructor(d: UserInput) {
    this.createdAt = new Date()
    this.updatedAt = new Date()
    this.notes = []
    this.password = bcrypt.hashSync(d.password, 10)
    this.email = d.email
    this.fullName = d.fullName
    this.username = d.username
  }
}
