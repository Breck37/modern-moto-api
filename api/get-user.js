import connectToDatabase from './utils/connectToDatabase';

const createUser = async (db, { email }) => {
  if (!email) {
    return res.status(400).json({
      success: false,
      error: "No user to create",
    });
  }

  const baseUser = {
    archived: false,
    email,
    username: email,
    currentMode: 1,
    leagues: [],
    weeklyResults: [],
  };

  const result = await db.collection('users')
    .insertOne(baseUser);

    console.log('INSERT RESULT', result);
    return result
};

module.exports = async (req, res) => {
    const { email } = req.query;

    const db = await connectToDatabase(process.env.MONGO_URI);


    let user = await db.collection('users').findOne({ email });
    const picks = await db.collection('picks').find({ user: email })

    if (!user || (Array.isArray(user) && !user.length)) {
      user = await createUser(db, { email });
      console.log({ createUserResult: user })
    }

    return res.status(200).json({ success: true, user: { ...user, picks } });
  };