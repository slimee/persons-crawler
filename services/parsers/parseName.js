const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
const personNameRegex = /<(?:td.*?|div)>(.*?)<.*/s

const parseName = (encadre) => {
  const matchName = personNameRegex.exec(encadre)
  return matchName && matchName[1] && entities.decode(matchName[1].trim())
}

module.exports = parseName