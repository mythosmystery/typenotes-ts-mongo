import {
  Resolver,
  Query,
  Ctx,
  Authorized,
  Field,
  FieldResolver,
  Root
} from 'type-graphql'
import { Note, User } from '../models'
import { UserService } from '../services/UserService'
import { Context } from '../types'
import { NoteService } from '../services'

@Resolver(User)
export class UserResolver {
  private userService = new UserService()
  private noteService = new NoteService()

  @Authorized()
  @Query(type => User)
  async me(@Ctx() ctx: Context) {
    return this.userService.findById(ctx.user!._id)
  }

  @FieldResolver(type => [Note])
  async notes(@Root() user: User) {
    return this.noteService.findByUserId(user._id!)
  }
}
