import { ObjectType, Field, ID, InputType } from 'type-graphql'
import { Document as MDoc, ObjectId } from 'mongodb'
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
  isPublic: boolean

  @Field()
  category: string

  @Field(type => [User])
  sharedWith: ObjectId[] | User[]

  @Field(type => [ID])
  likedBy: ObjectId[]

  @Field()
  likes: number

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field(type => User)
  createdBy: ObjectId | User

  constructor() {
    this.createdAt = new Date()
    this.updatedAt = new Date()
    this.likes = 0
    this.sharedWith = []
    this.likedBy = []
  }
}

@InputType()
export class NoteCreateInput implements Partial<Note> {
  @Field()
  title: string

  @Field()
  isPublic: boolean

  @Field({ nullable: true })
  body?: string

  @Field({ nullable: true })
  category?: string
}
