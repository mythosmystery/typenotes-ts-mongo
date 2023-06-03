import { getDB } from '../db'
import { startDB } from '../db'

export async function createIndexes() {
  await startDB()
  const db = getDB()
  await db.collection('User').createIndex({ email: 1 }, { unique: true })
  await db.collection('User').createIndex({ username: 1 }, { unique: true })
  await db.collection('Note').createIndex({ createdBy: 1 })
  await db.collection('Note').createIndex({ category: 1 })
  await db.collection('Note').createIndex({ isPublic: 1 })
  await db
    .collection('Note')
    .createIndex({ body: 'text', title: 'text', category: 'text' })
}

if (!process.env.TEST)
  createIndexes()
    .catch(console.error)
    .finally(() => process.exit(0))
