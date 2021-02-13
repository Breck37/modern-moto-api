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
  const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })

  const url = new URL(uri).pathname.substr(1);

  // Select the database through the connection,
  // using the database path of the connection string
  const db = await client.db(url)

  // Cache the database connection and return the connection
  cachedDb = db
  return db
}

const createUser = async (db, { email }) => {
  if (!email) {
    return res.status(400).json({
      success: false,
      error: "No user to create",
    });
  }

  const baseUser = {
    email,
    currentMode: 1,
    pastResults: [],
  };

  const result = await db.collection('users')
    .insertOne(baseUser);

    console.log('INSERT RESULT', result);
    return result
};

module.exports = async (req, res) => {
    const { email } = req.query;

    const db = await connectToDatabase(process.env.MONGO_URI);


    const user = await db.collection('users').findOne({ email });
    console.log({ user });

    if (!user || (Array.isArray(user) && !user.length)) {
      const createUserResult = await createUser(db, { email });
      console.log({ createUserResult })
      return res.status(200).json({ success: true, message: 'created user', email });
    }

    return res.status(200).json({ success: true, user });
  };