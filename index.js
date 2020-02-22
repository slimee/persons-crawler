require('dotenv').config()

const logger = require('./services/utils/logger')
const { startLogStat, stopLogStat } = require('./services/utils/logStat')
const { init: initCrawl, crawl } = require('./services/crawler/crawl')
const start = require('./services/utils/start')
const conf = require('./services/utils/' + process.env.CONF_NAME)

const nbCrawler = Number(process.env.NB_CRAWLER)
const startCrawl = () => start(nbCrawler, crawl)
const logEnd = () => logger.info('END OF ALL')
const logError = e => logger.error(e)

initCrawl(conf)
  .then(startLogStat)
  .then(startCrawl)
  .then(logEnd)
  .then(stopLogStat)
  .catch(logError)