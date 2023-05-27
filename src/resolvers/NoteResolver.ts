import { Resolver, Query, Ctx, Authorized } from 'type-graphql'
import { Note } from '../models'
import { NoteService } from '../services'
import { Context } from '../types'

@Resolver(Note)
export class NoteResolver {
  private noteService = new NoteService()

  @Query(returns => [Note])
  async noteMany(@Ctx() ctx: Context) {
    console.log(ctx.user)
    return this.noteService.findAll()
  }
}
