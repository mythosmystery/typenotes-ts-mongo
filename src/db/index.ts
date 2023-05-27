import { Collection, Db, MongoClient, Document } from 'mongodb'

let _client: MongoClient

export const startDB = async (): Promise<MongoClient> => {
  if (_client) return _client
  const client = await MongoClient.connect(
    process.env.MONGO_URL || `mongodb://localhost:27017`
  )
  _client = client
  return client
}

export const getDB = (): Db => {
  return _client.db('app')
}

export const getCollection = <T extends Document>(
  collName: string
): Collection<T> => {
  return getDB().collection<T>(collName)
}
