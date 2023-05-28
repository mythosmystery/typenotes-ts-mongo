import { Request } from 'express-jwt'
import { TokenUser } from '../types'
import { createAccessToken, decodeToken } from './authUtils'
import { RequestHandler } from 'express'
import { UserService } from '../services'

export const authMiddleware: RequestHandler = async (
  req: Request<TokenUser>,
  res,
  next
): Promise<any> => {
  const userService = new UserService()

  const accessToken = req.headers[`x-access-token`]?.toString().split(' ')[1]
  const refreshToken = req.headers[`x-refresh-token`]?.toString().split(' ')[1]

  if (!accessToken || !refreshToken) {
    req.auth = undefined
    next()
    return
  }

  let decoded = decodeToken(accessToken) as TokenUser | null

  if (decoded) {
    req.auth = decoded
    next()
    return
  }

  console.log(`access token expired`)

  const refreshDecoded = decodeToken(refreshToken) as TokenUser | null

  if (!refreshDecoded) {
    req.auth = undefined
    next()
    return
  }

  console.log(`refresh token valid`)

  try {
    // this is where you would check to make sure not banned, get new roles, etc.
    const { _id, email } = await userService.findByEmail(refreshDecoded.email)

    const newAccessToken = createAccessToken({
      _id: _id!.toString(),
      email
    })

    res.setHeader(`X-Access-Token`, newAccessToken)
    decoded = decodeToken(newAccessToken) as TokenUser
    req.auth = decoded
  } catch (_) {
    req.auth = undefined
    next()
  }
  next()
}
