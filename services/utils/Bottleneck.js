const logger = require('./logger')

const later = require('../utils/later')

module.exports = class Bottleneck {
  constructor(minTime) {
    this.setMinTime(minTime)
    this.updateLastFetchMoment()
    this.queue = []
  }

  updateLastFetchMoment() {
    this.lastFetch = new Date().getTime()
  }

  setMinTime(minDelay = 70) {
    this.minDelay = minDelay
    logger.info(`DELAY_BETWEEN_2_REQUESTS: ${minDelay}ms`)
  }

  getPrevious() {
    return this.queue.length
      && this.queue[this.queue.length - 1]
      || Promise.resolve()
  }

  addToQueue(item) {
    this.queue.push(item)
    item.then(() => {
      this.queue.indexOf(item) !== -1 && this.queue.splice(this.queue.indexOf(item), 1)
    })
  }

  schedule(fct, param) {
    const job = () => fct(param)
    const previous = this.getPrevious()
    const current = previous
      .then(() => later(this.getPause()))
      .then(job)
    this.addToQueue(current)
    return current
  }

  getPause() {
    return Math.max(0, new Date().getTime() - (this.lastFetch + this.minDelay))
  }

}