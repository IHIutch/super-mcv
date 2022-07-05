const { MongoClient, ServerApiVersion } = require('mongodb')
const uri = process.env.MONGO_DB_URI
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
})
client.connect((err) => {
  const collection = client.db(process.env.MONGO_DB_NAME).collection('surveys')
  // perform actions on the collection object
  client.close()
})
