import { Collection, Filter, ObjectId } from 'mongodb'
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

  async findByIdPublic(id: string, userId?: string): Promise<Note> {
    const note = await this.db.findOne({
      _id: new ObjectId(id),
      $or: [{ isPublic: true }, { createdBy: new ObjectId(userId) }]
    })
    if (!note) throw new Error('Note not found')
    return note
  }

  async create(note: Note): Promise<Note> {
    const { insertedId } = await this.db.insertOne(note)
    return this.findById(insertedId)
  }

  async update(note: Partial<Note>): Promise<Note> {
    const { _id, ...rest } = note
    await this.db.updateOne(
      { _id },
      { $set: { ...rest, updatedAt: new Date() } }
    )
    return this.findById(_id!)
  }

  async updateCategory(
    oldCategory: string,
    newCategory: string,
    userId: ObjectId
  ): Promise<number> {
    const { modifiedCount } = await this.db.updateMany(
      { category: oldCategory, createdBy: userId },
      { $set: { category: newCategory } }
    )
    return modifiedCount
  }

  async delete(id: ObjectId): Promise<boolean> {
    const { deletedCount } = await this.db.deleteOne({ _id: id })
    return deletedCount === 1
  }

  async deleteByUserId(userId: ObjectId): Promise<boolean> {
    const { deletedCount } = await this.db.deleteMany({ createdBy: userId })
    return deletedCount > 0
  }

  async addSharedWith(noteId: ObjectId, userId: ObjectId): Promise<boolean> {
    const { modifiedCount } = await this.db.updateOne(
      { _id: noteId },
      { $addToSet: { sharedWith: userId } }
    )
    return modifiedCount === 1
  }

  async removeSharedWith(noteId: ObjectId, userId: ObjectId): Promise<boolean> {
    const { modifiedCount } = await this.db.updateOne(
      { _id: noteId },
      { $pull: { sharedWith: userId } }
    )
    return modifiedCount === 1
  }

  async like(noteId: ObjectId, userId: ObjectId): Promise<boolean> {
    const { modifiedCount } = await this.db.updateOne(
      { _id: noteId },
      { $addToSet: { likedBy: userId }, $inc: { likes: 1 } }
    )
    return modifiedCount === 1
  }

  async unlike(noteId: ObjectId, userId: ObjectId): Promise<boolean> {
    const { modifiedCount } = await this.db.updateOne(
      { _id: noteId },
      { $pull: { likedBy: userId }, $inc: { likes: -1 } }
    )
    return modifiedCount === 1
  }
}
