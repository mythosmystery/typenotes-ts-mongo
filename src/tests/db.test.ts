import 'reflect-metadata'
import { getDB, startDB } from '../db'
import { User } from '../models'

test('startDB should return a client', async () => {
  const client = await startDB()
  expect(client).toBeDefined()
  await client.close()
})

test('getDB should return a db', async () => {
  const db = await getDB()
  expect(db).toBeDefined()
  expect(db.databaseName).toBe('test')
})

test('getCollection should return a collection', async () => {
  const coll = await getDB().collection('test')
  expect(coll).toBeDefined()
})

test('getCollection should return the correct collection', async () => {
  const coll = await getDB().collection<User>('User')
  expect(coll).toBeDefined()
  expect(coll.collectionName).toBe('User')
})
