const parseEncadre = (body, url) =>
  findTag(body, '<div class="infobox', 'div', url)
  ||
  findTag(body, '<table class="infobox', 'table', url)

const findTag = (body, tagStart, tagName, url) => {
  const startIndex = body.indexOf(tagStart)
  if (startIndex === -1) return

  const endIndex = findEndIndex(body, startIndex, tagName, url)
  return { encadre: body.substring(startIndex, endIndex), startIndex, endIndex }
}

const infiniteIfNotFound = value => value === -1 ? Number.MAX_SAFE_INTEGER : value

const findEndIndex = (body, startIndex, tagName, url) => {
  const starting = `<${tagName}`
  const closing = `</${tagName}`

  let index = startIndex + 1
  let level = 1

  do {
    const nextStartPosition = infiniteIfNotFound(body.indexOf(starting, index))
    const nextClosingPosition = infiniteIfNotFound(body.indexOf(closing, index))
    level += nextClosingPosition < nextStartPosition ? -1 : 1
    index = Math.min(nextClosingPosition, nextStartPosition) + 1
  } while (level !== 0 && level < 100)

  if (level >= 100) {
    console.log('level too hight', url)
    return startIndex
  }

  return index + 2 + tagName.length//to include end tag in substr
}

module.exports = parseEncadre