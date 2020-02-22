const { extractText } = require('../utils/extractText')

const introDoesNotStartWith = ['Considérez', 'Une réorg', '<b>En pra', 'Le texte', 'Si vous', 'Vous pou', 'Améliorez', 'La mise en', 'Consultez la']

const inRange = (range, index) => range && range.startIndex < index && index <= range.endIndex

const isIntro = (p, excludeRange, foundAt) =>
  !introDoesNotStartWith.find(e => p.startsWith(e))
  && !inRange(excludeRange, foundAt)

const parseIntro = (body, excludeRange) => {
  const introRegex = /<p>(.*?)<\/p>/gs
  let intro
  do {
    intro = introRegex.exec(body)[1]
  } while (!isIntro(intro, excludeRange, introRegex.lastIndex))
  return extractText(intro)
}

module.exports = parseIntro