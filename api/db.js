const url = require('url')
const MongoClient = require('mongodb').MongoClient

let cachedDb = null

async function connectToDatabase() {
  const mongoURL = `${process.env.MONGO_URL}/clips?retryWrites=true&w=majority`

  if (cachedDb) {
    return cachedDb
  }

  const client = await MongoClient.connect(mongoURL, { useNewUrlParser: true })

  const db = await client.db(url.parse(mongoURL).pathname.substr(1))

  cachedDb = db
  return db
}

module.exports = {
  connectToDatabase,
}
