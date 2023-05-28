import { getDB } from '../db'
import { startDB } from '../db'

async function createIndexes() {
  await startDB()
  const db = getDB()
  await db.collection('User').createIndex({ email: 1 }, { unique: true })
  await db.collection('User').createIndex({ username: 1 }, { unique: true })
}

createIndexes()
  .catch(console.error)
  .finally(() => process.exit(0))
