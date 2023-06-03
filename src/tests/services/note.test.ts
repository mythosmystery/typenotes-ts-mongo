import 'reflect-metadata'
import { ObjectId } from 'mongodb'
import { clearDB, closeDB, startDB } from '../../db'
import { createIndexes } from '../../migrations'
import { Note, User } from '../../models'
import { NoteService, UserService } from '../../services'

describe('Note Service', () => {
  let noteService: NoteService
  let userService: UserService
  beforeAll(async () => {
    await startDB()
    await createIndexes()
    userService = new UserService()
    noteService = new NoteService()
  })
  afterAll(async () => {
    await clearDB()
    await closeDB()
  })
  describe('create', () => {
    it('should create a note', async () => {
      const userInput = {
        email: 'notes@test.com',
        fullName: 'Test User',
        username: 'notesuser',
        password: 'testpassword'
      }
      const user = await userService.create(userInput)

      const note = new Note()
      note.title = 'Test Note'
      note.body = 'Test Note Body'
      note.category = 'Test Note Category'
      note.isPublic = true
      note.createdBy = new ObjectId(user._id)
      const newNote = await noteService.create(note)
      expect(newNote).toBeDefined()
      expect(newNote._id).toBeDefined()
      expect(newNote.title).toBe(note.title)
      expect(newNote.body).toBe(note.body)
      expect(newNote.category).toBe(note.category)
      expect(newNote.isPublic).toBe(note.isPublic)
      expect(newNote.createdBy).toEqual(note.createdBy)
    })
  })
  describe('findByUserId', () => {
    it('should find notes by user id', async () => {
      const email = 'notes@test.com'
      const user = await userService.findByEmail(email)
      const notes = await noteService.findByUserId(new ObjectId(user._id))
      expect(notes).toBeDefined()
      expect(
        notes.every(note => note.createdBy.toString() === user._id!.toString())
      ).toBe(true)
    })
  })
  describe('update', () => {
    it('should update a note', async () => {
      const [note] = await noteService.findAll()
      const updatedNote = await noteService.update({
        _id: note._id,
        title: 'Updated Note'
      })
      expect(updatedNote).toBeDefined()
      expect(updatedNote._id).toEqual(note._id)
      expect(updatedNote.title).toBe('Updated Note')
    })
  })
  describe('updateCategory', () => {
    it('should update a note category', async () => {
      const user = await userService.findByEmail('notes@test.com')
      const newNote = new Note()
      newNote.title = 'Test Note 2'
      newNote.body = 'Test Note Body 2'
      ;(newNote.category = 'Test Note Category'), (newNote.isPublic = true)
      newNote.createdBy = user._id!
      await noteService.create(newNote)

      const updateCount = await noteService.updateCategory(
        'Test Note Category',
        'Updated Note Category',
        user._id!
      )
      expect(updateCount).toBe(2)
    })
  })
})
