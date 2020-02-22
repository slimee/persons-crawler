const hrefRegex = /href="(.*?)(?:#.*?)?"/g

module.exports = page => {
  const urls = []
  let res
  while ((res = hrefRegex.exec(page)) !== null) {
    urls.push(res[1])
  }
  return urls
}
