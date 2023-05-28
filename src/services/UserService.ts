import { Collection, ObjectId } from 'mongodb'
import { getCollection } from '../db'
import { User } from '../models'
import bcrypt from 'bcrypt'

interface UserInput {
  email: string
  fullName: string
  username: string
  password: string
}

export class UserService {
  db: Collection<User>

  constructor() {
    this.db = getCollection<User>('User')
  }
  async findAll(): Promise<User[]> {
    return this.db.find().toArray()
  }
  async findById(id: string): Promise<User> {
    const user = await this.db.findOne({ _id: new ObjectId(id) })
    if (!user) throw new Error(`User with id ${id} not found`)
    return user
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.db.findOne({ email })
    if (!user) throw new Error(`User with email ${email} not found`)
    return user
  }

  async create(userInput: UserInput): Promise<User> {
    const user: User = {
      ...userInput,
      password: bcrypt.hashSync(userInput.password, 10),
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: []
    }
    const { insertedId } = await this.db.insertOne(user, {})
    const createdUser = await this.db.findOne({ _id: insertedId })
    if (!createdUser) throw new Error('User not created')
    return createdUser
  }

  async resetPassword(email: string, newPassword: string): Promise<void> {
    const hash = bcrypt.hashSync(newPassword, 10)
    const user = await this.findByEmail(email)
    await this.db.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hash,
          updatedAt: new Date()
        }
      }
    )
  }
}
