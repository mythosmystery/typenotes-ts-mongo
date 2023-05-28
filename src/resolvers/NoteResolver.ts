import {
  Resolver,
  Query,
  Ctx,
  Authorized,
  FieldResolver,
  Root
} from 'type-graphql'
import { Note, User } from '../models'
import { NoteService, UserService } from '../services'
import { Context } from '../types'

@Resolver(Note)
export class NoteResolver {
  private noteService = new NoteService()
  private userService = new UserService()

  @Query(returns => [Note])
  async noteMany() {
    return this.noteService.findAll()
  }

  @FieldResolver(type => User)
  async createdBy(@Root() note: Note) {
    return this.userService.findById(note.createdBy.toString())
  }
}
