// Import Dependencies
import MongoClient from ('mongodb').MongoClient;

// Create cached connection variable
let cachedDb = null

// A function for connecting to MongoDB,
// taking a single parameter of the connection string
export default async function connectToDatabase(uri) {
  // If the database connection is cached,
  // use it instead of creating a new connection
  if (cachedDb) {
    return cachedDb
  }

  // If no connection is cached, create a new one
  const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })

  const url = new URL(uri).pathname.substr(1);

  // Select the database through the connection,
  // using the database path of the connection string
  const db = await client.db(url)

  // Cache the database connection and return the connection
  cachedDb = db
  return db
}