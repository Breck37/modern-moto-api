import connectToDatabase from "./utils/connectToDatabase";

const createUser = async (db, { email }) => {
  if (!email) {
    return { success: false, email };
  }

  const baseUser = {
    archived: false,
    email,
    username: email?.split("@")[0],
    currentMode: 1,
    leagues: [],
    weeklyResults: [],
  };

  const result = await db.collection("users").insertOne(baseUser);

  return result;
};

module.exports = async (req, res) => {
  const { email, week } = req.query;
  const db = await connectToDatabase(process.env.MONGO_URI);

  let user = await db.collection("users").findOne({ email });
  const picks = await db.collection("picks").find({ user: email }).toArray();
  console.log({ week: parseInt(week) });
  if (Array.isArray(picks) && picks.length && picks[0].league) {
    const leaguePicks = await db
      .collection("picks")
      .find({ league: picks[0].league, week: parseInt(week) })
      .toArray();
    user.leaguePicks = leaguePicks || null;
  }

  if (!user || (Array.isArray(user) && !user.length)) {
    user = await createUser(db, { email });
    console.log({ createUserResult: user });
    if (user.success === false) {
      return res
        .status(200)
        .json({ success: false, message: "error saving user" });
    }
  }

  return res.status(200).json({ success: true, user: { ...user, picks } });
};
