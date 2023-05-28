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

  async findById(id: ObjectId): Promise<Note> {
    const note = await this.db.findOne({ _id: id })
    if (!note) throw new Error('Note not found')
    return note
  }

  async create(note: Note): Promise<Note> {
    const { insertedId } = await this.db.insertOne(note)
    return this.findById(insertedId)
  }

  async update(note: Partial<Note>): Promise<Note> {
    const { _id, ...rest } = note
    await this.db.updateOne({ _id }, { $set: rest })
    return this.findById(_id!)
  }

  async delete(id: ObjectId): Promise<boolean> {
    const { deletedCount } = await this.db.deleteOne({ _id: id })
    return deletedCount === 1
  }

  async deleteByUserId(userId: ObjectId): Promise<boolean> {
    const { deletedCount } = await this.db.deleteMany({ createdBy: userId })
    return deletedCount > 0
  }
}
