import { TokenUser } from '../types'
import { createAccessToken, decodeToken } from '../auth/authUtils'

test('generates a valid access token', () => {
  const user = {
    _id: '123',
    email: 'test'
  }
  const token = createAccessToken(user)
  const result = decodeToken(token) as TokenUser
  expect(result._id).toBe(user._id)
})
