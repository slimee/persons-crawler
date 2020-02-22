const logger = require('../utils/logger')
const makeSetStore = require('./makeSetStore')
let visited
let toVisit

const init = async seedUrl => {
  logger.info('SEED_URL', seedUrl)
  toVisit = makeSetStore('toVisit')
  visited = makeSetStore('visited')

  await toVisit.clear()
  await visited.clear()

  return add(seedUrl)
}

const add = url =>
  visited.has(url)
    .then(urlIsVisited => !urlIsVisited && toVisit.add(url))

const peek = () => toVisit.peek()
  .then(url => url && visited.add(url).then(() => url))
  .then(normalize)

const normalize = url =>
  url && url.indexOf('/wiki') === 0 ? `https://fr.wikipedia.org${url}` : url

const leftCount = () => toVisit.count()
const doneCount = () => visited.count()
const addAll = async urls => {
  for (const url of urls) {
    await add(url)
  }
}
module.exports = { init, add, peek, leftCount, doneCount, addAll }