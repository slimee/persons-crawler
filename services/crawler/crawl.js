const got = require('got')
const later = require('../utils/later')
const { dbConnect } = require('../stores/db')
const logger = require('../utils/logger')
const Bottleneck = require('../utils/Bottleneck')
const urlStore = require('../stores/newUrlStore')
const makeParsePerson = require('../parsers/makeParsePerson')
const parseUrlFromPage = require('../parsers/parseUrlsFromPage')
const parseDuration = require('../parsers/parseDuration')
const personStore = require('../stores/personStore')
const makePropertyStore = require('../stores/propertyStore')

let delayBetween2Requests = parseDuration(process.env.DELAY_BETWEEN_2_REQUESTS)
let barrier429Duration = parseDuration(process.env.BARRIER_429_DURATION)
const increase429Of = Number(process.env.INCREASE_429_OF)
const initialNoUrlNbRetries = Number(process.env.INITIAL_NO_URL_NB_RETRIES)
const noUrlRetryDelay = parseDuration(process.env.NO_URL_RETRY_DELAY)
const maxVisits = Number(process.env.MAX_VISITS)
let totalVisited

const limiter = new Bottleneck(delayBetween2Requests)

let alert429 = false
let barrier429 = Promise.resolve()
let shouldVisitThisUrl
let parsePerson
let lookupProperty

const init = async ({ seedUrl, urlFilter }) => {
  totalVisited = 0
  shouldVisitThisUrl = urlFilter
  await dbConnect()
  await urlStore.init(seedUrl)
  await personStore.init()
  parsePerson = makeParsePerson()
  lookupProperty = makePropertyStore()
}

const incrementDelayBetween2Request = () => {
  delayBetween2Requests += increase429Of
  limiter.setMinTime(delayBetween2Requests)
}

const handle429 = () => {
  if (!alert429) {
    alert429 = true
    barrier429 = later(barrier429Duration)
    barrier429.then(() => alert429 = false)
    incrementDelayBetween2Request()
    logger.info(`429 handle: BARRIER DURING ${barrier429Duration}ms. NEW DELAY: ${delayBetween2Requests}ms`)
  }
}

const crawl = async (index, retries = initialNoUrlNbRetries) => {
  if (maxVisits && totalVisited >= maxVisits) return Promise.resolve()

  const url = await urlStore.peek()
  if (url) {
    return visit(index, url)
      .then(() => crawl(index, initialNoUrlNbRetries))
  } else {
    logger.info(`#${index} NO URL... retry ${retries}`)
    retries -= 1
    if (retries >= 0) {
      return new Promise((accept) => {
        setTimeout(() => crawl(index, retries).then(accept), noUrlRetryDelay)
      })
    } else {
      return Promise.resolve('No more retries.')
    }
  }
}

const visit = async (index, url) => {
  await barrier429
  //logger.info('[VISITING]', index, url)
  return alert429 && Promise.resolve()
    ||
    limiter.schedule(got, url)
      .then(async ({ body }) => {
        totalVisited += 1
        await peekUrls(body)
        const person = await peekPerson({ body, url })
        person && personStore.add(person)
      })
      .catch(async (e) => {
        if (e.statusCode === 429) {
          handle429()
          await urlStore.add(url)
          logger.error(index, `${e.statusCode} on ${url}`)
        } else if (e.statusCode) {
          logger.error(index, `${e.statusCode} on ${url}`)
        } else if (e.code === 11000) {
          // NO OP, duplicate on imgUrl.
        } else {
          logger.error(index, e)
        }
      })
}

const peekUrls = body => urlStore.addAll(
  parseUrlFromPage(body)
    .filter(shouldVisitThisUrl),
)

const peekPerson = async ({ url, body }) => {
  const person = await parsePerson({ url, body })
  person && (person.properties = await lookupProperty(person.properties))
  return person
}

module.exports = { init, crawl }