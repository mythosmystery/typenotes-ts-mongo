import { Resolver, Query, Ctx, Authorized } from 'type-graphql'
import { User } from '../models'
import { UserService } from '../services/UserService'
import { Context } from '../types'

@Resolver(User)
export class UserResolver {
  private userService = new UserService()

  @Authorized()
  @Query(type => [User])
  async me(@Ctx() ctx: Context) {
    return this.userService.findById(ctx.user!._id)
  }
}
