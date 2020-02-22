module.exports = value =>
  value.endsWith('min') ? Number(value.replace('min', '')) * 60 * 1000
    :
    value.endsWith('sec') ? Number(value.replace('sec', '')) * 1000
      :
      value.endsWith('ms') ? Number(value.replace('ms', ''))
        :
        (() => {
          throw new Error(`can't parseDuration ${value}`)
        })()