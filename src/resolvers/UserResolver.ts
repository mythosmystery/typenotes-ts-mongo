import {
  Resolver,
  Query,
  Ctx,
  Authorized,
  Field,
  FieldResolver,
  Root,
  InputType,
  Mutation,
  Arg
} from 'type-graphql'
import { Note, User } from '../models'
import { UserService } from '../services/UserService'
import { Context } from '../types'
import { NoteService } from '../services'
import { ObjectId } from 'mongodb'

@InputType()
class UserInput implements Partial<User> {
  @Field({ nullable: true })
  fullName?: string

  @Field({ nullable: true })
  username?: string
}

@Resolver(User)
export class UserResolver {
  private userService = new UserService()
  private noteService = new NoteService()

  @Authorized()
  @Query(type => User)
  async me(@Ctx() ctx: Context) {
    return this.userService.findById(new ObjectId(ctx.user!._id))
  }

  @Authorized()
  @Mutation(type => User)
  async userUpdate(@Ctx() ctx: Context, @Arg('data') data: UserInput) {
    return this.userService.update({
      ...data,
      _id: new ObjectId(ctx.user!._id)
    })
  }

  @Authorized()
  @Mutation(type => Boolean)
  async userDelete(@Ctx() ctx: Context) {
    await Promise.all([
      this.noteService.deleteByUserId(new ObjectId(ctx.user!._id)),
      this.userService.delete(new ObjectId(ctx.user!._id))
    ])
    return true
  }

  @FieldResolver(type => [Note])
  async notes(@Root() user: User) {
    return this.noteService.findByUserId(user._id!)
  }
}
