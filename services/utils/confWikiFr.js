const urlFilter = url =>
  url
  &&
  (url.startsWith('/wiki') || url.startsWith('https://fr.wikipedia.org/wiki'))
  &&
  url.indexOf('Mod%C3%A8le:') === -1
  &&
  url.indexOf('/Aide:') === -1
  &&
  url.indexOf('/Fichier:') === -1
  &&
  url.indexOf('/Wikip%C3%A9dia:') === -1
  &&
  url.indexOf('/Wikipédia:') === -1
  &&
  url.indexOf('/Image:') === -1
  &&
  url.indexOf('/Modèle:') === -1
  &&
  url.indexOf('/Template:') === -1
  &&
  url.indexOf('/Category:') === -1
  &&
  url.indexOf('/Discuter:') === -1
  &&
  url.indexOf('/Special:') === -1
  &&
  url.indexOf('/Sp%C3%A9cial:') === -1
  &&
  url.indexOf('/Spécial:') === -1
  &&
  url.indexOf('/Projet:') === -1
  &&
  url.indexOf('/wiki//') === -1
  &&
  url.indexOf('/Discussion:') === -1
  &&
  url.indexOf('/Discussion_') === -1
  &&
  url.indexOf('/Utilisateur:') === -1
  &&
  url.indexOf('/Catégorie:') === -1
  &&
  url.indexOf('/Cat%C3%A9gorie:') === -1
  &&
  url.indexOf('/Portail:') === -1
  &&
  url.indexOf('/Utilisateur:') === -1

const seedUrl = process.env.SEED_URL

module.exports = { urlFilter, seedUrl }