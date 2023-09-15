/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("yelqvt9gny7lhm6")

  collection.name = "courses"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("yelqvt9gny7lhm6")

  collection.name = "coures"

  return dao.saveCollection(collection)
})
