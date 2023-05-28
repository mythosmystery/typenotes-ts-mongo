import { Collection, ObjectId } from 'mongodb'
import { getCollection } from '../db'
import { Note } from '../models'

export class NoteService {
  db: Collection<Note>

  constructor() {
    this.db = getCollection<Note>('Note')
  }
  async findAll(): Promise<Note[]> {
    return this.db.find().toArray()
  }

  async findByUserId(userId: ObjectId): Promise<Note[]> {
    return this.db.find({ createdBy: userId }).toArray()
  }
}
