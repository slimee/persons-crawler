const parseImgUrl = require('./parseImgUrl')
const parseName = require('./parseName')
const parseEncadre = require('./parseEncadre')
const parseIntro = require('./parseIntro')
const { makeParseWikiDate, makeParseTag, makeParseLinks } = require('./parseAny')

const makeParsePerson = () => {
  const parseAInfluence = makeParseLinks('A influencé')
  const parseInfluencePar = makeParseLinks('Influencé par')
  const parseOeuvresPrincipales = makeParseLinks('Œuvres principales')
  const parseEcoleTradition = makeParseLinks('École/tradition')
  const parsePrincipauxInterets = makeParseLinks('Principaux intérêts')
  const parseDomaines = makeParseLinks('Domaine')
  const parseFormation = makeParseLinks('Formation')
  const parseIdeesRemarquables = makeParseLinks('Idées remarquables')
  const parseRenommePour = makeParseLinks('Renommé pour')
  const parseProfession = makeParseLinks('Profession')
  const parseNationalite = makeParseLinks('Nationalité')
  const parseDistinctions = makeParseLinks('Distinction')
  const parseActivityFrom = makeParseLinks('Activité', 'Activité principale')
  const parseEnfantFrom = makeParseLinks('Enfant')
  const parseDeath = makeParseWikiDate('Décès')
  const parseBirth = makeParseWikiDate('Naissance')
  const parseCitation = makeParseTag('Citation', 'i')

  const assign = (object, key, value) => value && (object[key] = value)
  const addProperty = (person, property) => property && person.properties.push(...property)

  return ({ url, body }) => {
    const result = parseEncadre(body, url)
    if (!result) return null
    const { encadre, startIndex, endIndex } = result
    const name = encadre && parseName(encadre)
    const birth = name && parseBirth(encadre)
    if (!birth) return null
    const person = { url: decodeURI(url), name, birth }

    assign(person, 'imgUrl', parseImgUrl(encadre))
    assign(person, 'death', parseDeath(encadre))
    assign(person, 'citation', parseCitation(encadre))
    assign(person, 'intro', parseIntro(body, { startIndex, endIndex }))

    person.properties = []
    addProperty(person, parseFormation(encadre))
    addProperty(person, parseInfluencePar(encadre))
    addProperty(person, parseAInfluence(encadre))
    addProperty(person, parseOeuvresPrincipales(encadre))
    addProperty(person, parseEcoleTradition(encadre))
    addProperty(person, parsePrincipauxInterets(encadre))
    addProperty(person, parseDomaines(encadre))
    addProperty(person, parseIdeesRemarquables(encadre))
    addProperty(person, parseRenommePour(encadre))
    addProperty(person, parseDistinctions(encadre))
    addProperty(person, parseProfession(encadre))
    addProperty(person, parseNationalite(encadre))
    addProperty(person, parseActivityFrom(encadre))
    addProperty(person, parseEnfantFrom(encadre))

    return person
  }
}

module.exports = makeParsePerson