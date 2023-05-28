import { Request } from 'express-jwt'
import { TokenUser } from '../types'
import { createAccessToken, decodeToken } from './authUtils'
import { RequestHandler } from 'express'

export const authMiddleware: RequestHandler = (
  req: Request<TokenUser>,
  res,
  next
): void => {
  const accessToken = req.headers[`x-access-token`]?.toString().split(' ')[1]
  const refreshToken = req.headers[`x-refresh-token`]?.toString().split(' ')[1]
  if (accessToken && refreshToken) {
    let decoded = decodeToken(accessToken) as TokenUser | null
    if (!decoded) {
      console.log(`access token expired`)
      const refreshDecoded = decodeToken(refreshToken) as TokenUser | null
      if (refreshDecoded) {
        console.log(`refresh token valid`)
        // this is where you would check to make sure not banned, get new roles, etc.
        const newAccessToken = createAccessToken(refreshDecoded)
        res.setHeader(`X-Access-Token`, newAccessToken)
        decoded = decodeToken(newAccessToken) as TokenUser
      }
    }
    req.auth = decoded || undefined
  }
  next()
}
