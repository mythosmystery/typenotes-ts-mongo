import {
  Resolver,
  Query,
  Ctx,
  Authorized,
  FieldResolver,
  Root,
  Arg,
  Mutation
} from 'type-graphql'
import { Auth, Note, User } from '../models'
import { NoteService, UserService } from '../services'
import { Context } from '../types'
import { ObjectId } from 'mongodb'

@Resolver(Note)
export class NoteResolver {
  private noteService = new NoteService()
  private userService = new UserService()

  @Query(returns => [Note])
  async noteMany() {
    return this.noteService.findAll()
  }

  @Query(returns => Note)
  async noteById(@Arg('id') id: string) {
    return this.noteService.findById(new ObjectId(id))
  }

  @Authorized()
  @Query(returns => [Note])
  async noteByUser(@Ctx() ctx: Context) {
    return this.noteService.findByUserId(new ObjectId(ctx.user!._id))
  }

  @Authorized()
  @Mutation(returns => Note)
  async noteCreate(
    @Arg('title') title: string,
    @Arg('body') body: string,
    @Ctx() ctx: Context
  ) {
    const note = new Note(body, title, ctx.user!._id)
    return this.noteService.create(note)
  }

  @Authorized()
  @Mutation(returns => Note)
  async noteUpdate(
    @Arg('id') id: string,
    @Ctx() ctx: Context,
    @Arg('title', { nullable: true }) title?: string,
    @Arg('body', { nullable: true }) body?: string
  ) {
    const note = await this.noteService.findById(new ObjectId(id))
    if (note.createdBy.toString() !== ctx.user!._id) {
      throw new Error('You can only update notes you created')
    }
    if (title) note.title = title
    if (body) note.body = body
    return this.noteService.update(note)
  }

  @Authorized()
  @Mutation(returns => Boolean)
  async noteDelete(@Arg('id') id: string, @Ctx() ctx: Context) {
    const note = await this.noteService.findById(new ObjectId(id))
    if (note.createdBy.toString() !== ctx.user!._id) {
      throw new Error('You can only delete notes you created')
    }
    return this.noteService.delete(note._id!)
  }

  @FieldResolver(type => User)
  async createdBy(@Root() note: Note) {
    return this.userService.findById(note.createdBy as ObjectId)
  }
}
