const logger = require('./logger')

const logEndOf = index => jobResult => logger.info(`END OF #${index}: ${JSON.stringify(jobResult)}`)

const start = (count, job) => {
  const lines = []
  for (let i = 1; i <= count; i++) {
    logger.info(`STARTING #${i}`)
    lines.push(Promise.resolve(job(i)).then(logEndOf(i)))
  }
  return Promise.all(lines)
}

module.exports = start