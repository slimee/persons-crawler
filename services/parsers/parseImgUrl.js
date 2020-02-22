const imgUrlRegex = /<div class="images".*?<img .*? src="(.*?)"/

const parseImgUrl = (encadre) => {
  const imgUrlRes = imgUrlRegex.exec(encadre)
  const imgUrl = imgUrlRes && imgUrlRes[1] && decodeURI(imgUrlRes[1])
  return imgUrl !== '/wiki/Aide:Insérer_une_image'
    &&
    imgUrl !== '/wiki/Aide:Images'
    &&
    imgUrl !== '/wiki/Fichier:Defaut.svg'
    &&
    imgUrl !== '/wiki/Fichier:P_vip.svg'
    &&
    imgUrl
}

module.exports = parseImgUrl