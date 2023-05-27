import { Collection } from 'mongodb'
import { getCollection } from '../db'
import { User } from '../models'

export class UserService {
  db: Collection<User>

  constructor() {
    this.db = getCollection<User>('Note')
  }
  async findAll(): Promise<User[]> {
    return this.db.find().toArray()
  }
  async findById(id: string): Promise<User> {
    const user = await this.db.findOne({ _id: id })
    if (!user) throw new Error(`User with id ${id} not found`)
    return user
  }
}
