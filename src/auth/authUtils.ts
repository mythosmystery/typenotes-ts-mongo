import { TokenUser } from '../types'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const secret = process.env.TOKEN_SECRET || 'asdljasfaiowfoajwf'

export const createRefreshToken = (user: TokenUser): string => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email
    },
    secret,
    {
      expiresIn: '90d',
      algorithm: 'HS256'
    }
  )
}

export const createAccessToken = (user: TokenUser): string => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email
    },
    secret,
    {
      expiresIn: '1m',
      algorithm: 'HS256'
    }
  )
}

export const generateTokens = (user: TokenUser) => {
  return {
    accessToken: createAccessToken(user),
    refreshToken: createRefreshToken(user)
  }
}

export const decodeToken = (token: string) => {
  try {
    return jwt.verify(token, secret, { algorithms: ['HS256'] })
  } catch (e) {
    // console.error(e)
    return null
  }
}

export const checkPassword = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash)
}
