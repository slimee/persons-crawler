const redis = require('redis')
const { promisify } = require('util')

const makeSetStore = key => {
  const client = redis.createClient()
  const flushall = promisify(client.flushall).bind(client)
  const sadd = promisify(client.sadd).bind(client)
  const spop = promisify(client.spop).bind(client)
  const sysmember = promisify(client.sismember).bind(client)
  const scard = promisify(client.scard).bind(client)

  const add = value => sadd(key, value)
  const peek = () => spop(key)
  const has = (value) => sysmember(key, value)
  const clear = () => flushall()
  const count = () => scard(key)

  return { add, peek, has, clear, count }
}

module.exports = makeSetStore