const logger = require('../utils/logger')
const personStore = require('../stores/personStore')
const urlStore = require('../stores/newUrlStore')

const parseDuration = require('../parsers/parseDuration')

let logStatEvery = parseDuration(process.env.LOG_STAT_EVERY)
let logStatRunning = true
let prevPersonsCount = 0
let prevVisitedCount = 0
let prevTotalCount = 0
const startLogStat = async () => {
  if (logStatRunning) {
    const doneCount = await urlStore.doneCount()
    const leftCount = await urlStore.leftCount()
    let deltaVisit = doneCount - prevVisitedCount
    let deltaPersons = personStore.count() - prevPersonsCount
    let newUrlsFound = leftCount - prevTotalCount

    let visitMin = deltaVisit * (60 * 60 * 1000 / logStatEvery)

    logger.info(`+${deltaPersons} pers, +${deltaVisit} visit (+${visitMin}/hr), +${newUrlsFound} to visit.   ${personStore.count()} persons, ${doneCount} done, ${leftCount} left.`)

    prevPersonsCount = personStore.count()
    prevVisitedCount = doneCount
    prevTotalCount = leftCount

    setTimeout(startLogStat, logStatEvery)
  } else {
    logger.info("log stat end")
  }
}
const stopLogStat = () => {
  logStatRunning = false
}

module.exports = { startLogStat, stopLogStat }