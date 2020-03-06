const { MongoClient, ObjectID } = require('mongodb')
const logger = require('../utils/logger')

let database = null

const dbConnectionString = process.env.DB_CONNECTION_STRING
const dbName = process.env.DB_NAME

const dbConnect = () =>
  database && Promise.resolve(database)
  ||
  Promise.resolve(dbConnectionString)
    .then(url => {
      logger.info(`CONNECTING TO %o`, url)
      return MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: false })
    })
    .then(client => {
      logger.info('CONNECTED')
      database = client.db(dbName)
    })

const col = function (collectionName) {
  return database.collection(collectionName)
}

module.exports = { dbConnect, col, ObjectID }