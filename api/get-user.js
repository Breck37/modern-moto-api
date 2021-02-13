// Import Dependencies
const MongoClient = require('mongodb').MongoClient

// Create cached connection variable
let cachedDb = null

// A function for connecting to MongoDB,
// taking a single parameter of the connection string
async function connectToDatabase(uri) {
  // If the database connection is cached,
  // use it instead of creating a new connection
  if (cachedDb) {
    return cachedDb
  }

  // If no connection is cached, create a new one
  const client = await MongoClient.connect(uri, { useNewUrlParser: true })

  const url = new URL(uri).athname.substr(1);

  // Select the database through the connection,
  // using the database path of the connection string
  const db = await client.db(url)

  // Cache the database connection and return the connection
  cachedDb = db
  return db
}

module.exports = async (req, res) => {
    console.log(req, req.query)
    // const { email } = req.params;

    const db = await connectToDatabase(process.env.MONGO_URI);

    const user = await db.collection('users').findOne({ email });

    if (!user || (Array.isArray(user) && !user.length)) {
      const result = await createUser({ email });
      return res.status(200).json(result);
    }

    return res.status(200).json({ success: true, user });
  };