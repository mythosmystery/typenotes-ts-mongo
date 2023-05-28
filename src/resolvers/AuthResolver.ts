import { Resolver, Query, InputType, Field, Arg, Mutation } from 'type-graphql'
import { UserService } from '../services'
import { User } from '../models'
import { Auth } from '../models'
import { checkPassword, generateTokens } from '../auth/authUtils'

@InputType()
class LoginInput implements Partial<User> {
  @Field()
  email: string

  @Field()
  password: string
}

@InputType()
class RegisterInput implements Partial<User> {
  @Field()
  email: string

  @Field()
  fullName: string

  @Field()
  username: string

  @Field()
  password: string
}

@Resolver(User)
export class AuthResolver {
  private userService = new UserService()

  @Mutation(type => Auth)
  async login(@Arg('data') data: LoginInput) {
    try {
      const user = await this.userService.findByEmail(data.email)
      const isPasswordCorrect = await checkPassword(
        data.password,
        user.password
      )
      if (!isPasswordCorrect) throw new Error('Password is incorrect')

      const { accessToken, refreshToken } = generateTokens({
        _id: user._id!.toString(),
        email: user.email
      })
      return { user, accessToken, refreshToken }
    } catch (err) {
      console.error(err)
      throw new Error('Login failed. Check your email and password')
    }
  }

  @Mutation(type => Auth)
  async register(@Arg('data') data: RegisterInput) {
    try {
      const user = await this.userService.create(data)
      const { accessToken, refreshToken } = generateTokens({
        _id: user._id!.toString(),
        email: user.email
      })
      return { user, accessToken, refreshToken }
    } catch (err) {
      if (err.code === 11000) {
        throw new Error(
          'User with this email or username already exists. Try logging in'
        )
      }
      throw new Error('Registration failed. Try again later')
    }
  }
}
