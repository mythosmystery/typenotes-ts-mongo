import 'reflect-metadata'
import { clearDB, closeDB, startDB } from '../../db'
import { UserService } from '../../services'
import { createIndexes } from '../../migrations'

describe('User Service', () => {
  let userService: UserService
  beforeAll(async () => {
    await startDB()
    await createIndexes()
    userService = new UserService()
  })
  afterAll(async () => {
    await clearDB()
    await closeDB()
  })
  describe('create', () => {
    it('should create a user', async () => {
      const userInput = {
        email: 'test@test.com',
        fullName: 'Test User',
        username: 'testuser',
        password: 'testpassword'
      }
      const user = await userService.create(userInput)
      expect(user).toBeDefined()
      expect(user._id).toBeDefined()
      expect(user.email).toBe(userInput.email)
      expect(user.fullName).toBe(userInput.fullName)
      expect(user.username).toBe(userInput.username)
      expect(user.password).not.toBe(userInput.password)
    })
  })
  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const email = 'test@test.com'
      const user = await userService.findByEmail(email)
      expect(user).toBeDefined()
      expect(user.email).toBe(email)
    })
  })
  describe('update', () => {
    it('should update a user', async () => {
      const email = 'test@test.com'
      const user = await userService.findByEmail(email)
      const updatedUser = await userService.update({
        _id: user._id,
        fullName: 'Updated User'
      })
      expect(updatedUser).toBeDefined()
      expect(updatedUser._id).toEqual(user._id)
      expect(updatedUser.fullName).toBe('Updated User')
    })
  })
})
