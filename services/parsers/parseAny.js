const Entities = require('html-entities').AllHtmlEntities
const entities = new Entities()

const makeCaptureTerm = (...keys) => {
  return `(${keys.join('|')})`
}

const makeExtractRawValue = (...keys) => {
  const stop = `${keys[0]}</th>`
  const keyRegex = new RegExp(`${makeCaptureTerm(...keys)}s?\\s*<\/th>`)
  const stopLength = stop.length
  return encadre => {
    const match = keyRegex.exec(encadre)
    const afterStartTdIndex = match && match.index
    if (!afterStartTdIndex || afterStartTdIndex === -1) return ''
    const beforeStopTdIndex = encadre.indexOf('</td>', afterStartTdIndex + stopLength) - 1
    return encadre.substring(afterStartTdIndex, beforeStopTdIndex)
  }
}

const parseLinks = (rawValue, type) => {
  if (rawValue.indexOf('<a ') === -1) return null
  const matches = [...rawValue.matchAll(hrefTitleRegex)]
  if (!matches.length) return null
  return matches
    .map(e => ({ href: decodeURI(e[1]), title: entities.decode(e[2]), type }))
    .filter(e => e.title.indexOf('Voir') !== 0 && e.title.indexOf('Drapeau') !== 0)
}

const datetimeRegex = /datetime="(.*?)"/
const parseWikiDate = rawValue => {
  if (!rawValue) return null
  const rawDate = parseRegex(rawValue, datetimeRegex)
  if (!rawDate) return null
  return rawDate.startsWith('U') ?
    new Date(Number(rawDate.substr(1, 5)), 0)
    :
    new Date(rawDate)
}

const parseRegex = (rawValue, regex) => {
  const match = regex.exec(rawValue)
  return match && match[1]
}

const hrefTitleRegex = /.*?href="(.*?)".*?title="(.*?)(?:"| \()/gs
const makeParseLinks = (key, ...synonyms) => {
  const extractRawValue = makeExtractRawValue(key, ...synonyms)
  return encadre => parseLinks(extractRawValue(encadre), key)
}

const makeParseWikiDate = key => {
  console.log('const makeParseWikiDate = key => {', key)
  const extractRawValue = makeExtractRawValue(key)
  return encadre => parseWikiDate(extractRawValue(encadre))
}

const makeParseTag = (key, tag) => {
  const extractRawValue = makeExtractRawValue(key)
  const tagRegex = new RegExp(`<${tag}>(.*?)<\/${tag}>`)
  return encadre => parseRegex(extractRawValue(encadre), tagRegex)
}

module.exports = { makeParseLinks, makeExtractRawValue, makeParseWikiDate, makeParseTag }