import { Collection, ObjectId } from 'mongodb'
import { getCollection } from '../db'
import { User } from '../models'
import bcrypt from 'bcrypt'

export interface UserInput {
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
  async findById(id: ObjectId): Promise<User> {
    const user = await this.db.findOne({ _id: id })
    if (!user) throw new Error(`User with id ${id} not found`)
    return user
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.db.findOne({ email })
    if (!user) throw new Error(`User with email ${email} not found`)
    return user
  }

  async create(userInput: UserInput): Promise<User> {
    const user = new User()
    user.email = userInput.email
    user.fullName = userInput.fullName
    user.username = userInput.username
    user.password = bcrypt.hashSync(userInput.password, 10)
    const { insertedId } = await this.db.insertOne(user, {})
    const createdUser = await this.db.findOne({ _id: insertedId })
    if (!createdUser) throw new Error('User not created')
    return createdUser
  }

  async update(user: Partial<User>): Promise<User> {
    const { _id, ...rest } = user
    await this.db.updateOne({ _id }, { $set: rest })
    return this.findById(_id!)
  }

  async delete(id: ObjectId): Promise<boolean> {
    const { deletedCount } = await this.db.deleteOne({ _id: id })
    return deletedCount === 1
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

  async addNote(noteId: ObjectId, userId: ObjectId): Promise<void> {
    await this.db.updateOne(
      { _id: userId },
      {
        $push: {
          notes: noteId
        }
      }
    )
  }

  async removeNote(noteId: ObjectId, userId: ObjectId): Promise<void> {
    await this.db.updateOne(
      { _id: userId },
      {
        $pull: {
          notes: noteId
        }
      }
    )
  }
}
