const removeBrackets = text => text.replace(/\[(?:\d+|[a-z])\]/g, '')

const extract = (start, end) => input => {
  let output = ''
  let currentIndex = 0
  let nextOpen = 0
  while (nextOpen < input.length) {
    nextOpen = input.indexOf(start, currentIndex)
    if (nextOpen === -1) {
      nextOpen = input.length
    }
    output += input.substring(currentIndex, nextOpen)
    currentIndex = input.indexOf(end, currentIndex) + end.length
  }
  return output
}

const removeHtml = extract('<', '>')
const removeStyle = extract('<style', '/style>')

module.exports.extractText = html => removeBrackets(removeHtml(removeStyle(html)))