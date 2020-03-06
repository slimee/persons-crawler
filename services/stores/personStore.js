const { col } = require('./db')
let total = 0

const add = person => col('persons')
  .updateOne({ imgUrl: person.imgUrl }, { $set: person }, { upsert: true })
  .then(({ upsertedCount }) => {
    total = total + upsertedCount
  })

const count = () => total

const init = async () => {
  await col('persons').createIndex({ birth: 1 })
  await col('persons').createIndex({ birth: -1 })
  await col('persons').createIndex({ name: 'text' })
}

module.exports = { add, count, init }