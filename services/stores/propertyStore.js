const { col, ObjectID } = require('./db')

const cache = {}

const makePropertyStore = () => {
  const collection = col('properties')
  collection.createIndex({ type: 1 })
  collection.createIndex({ title: 'text' })

  const lookupProperty = async property => {
    const fromCache = cache[property.title]
    if (!fromCache) {
      const fromDb = await collection.findOne({ title: property.title })
      if (fromDb) {
        let _id = fromDb._id;
        const updatedProperty = {_id, ...property}
        await collection.updateOne({_id}, {$set:updatedProperty})
        cache[updatedProperty.title] = updatedProperty
        return fromDb
      }else{
        property._id = new ObjectID()
        await collection.insertOne(property)
        cache[property.title] = property
        return property
      }
    }
    return fromCache
  }

  return properties => properties && Promise.all(properties.map(lookupProperty))
}

module.exports = makePropertyStore