const connectToDatabase = require("./utils/connectToDatabase");
const { compileLeaguePicks } = require('./utils/helpers/compilePicks');
const { decipher } = require('./utils/helpers/decipher');

// const createUser = async ({ email }) => {
//   if (!email) {
//     return { success: false, email };
//   }

//   const db = await connectToDatabase(process.env.MONGO_URI);

//   const baseUser = {
//     archived: false,
//     email,
//     username: email?.split("@")[0],
//     currentMode: 1,
//     leagues: [],
//     weeklyResults: [],
//   };

//   const result = await db.collection("users").insertOne(baseUser);

//   return result;
// };

module.exports = async (req, res) => {
  try {
    const { email, week, type, year } = req.query;

    if (!email) {
      return res.status(200).json({
        success: false,
        message: "email",
        emailUsed: email,
      });
    }

    const db = await connectToDatabase.default(process.env.MONGO_URI);

    let user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "db",
        user,
        emailUsed: email,
      });
    }
    const userHistoryQuery = { user: user.username };

    const userHistory = await db
      .collection("picks")
      .find(userHistoryQuery)
      .toArray();

    const currentRoumdQuery = { ...userHistoryQuery, type, week: parseInt(week), year: parseInt(year) };

    const currentRound = await db
    .collection("picks")
    .find(currentRoumdQuery, {
      bigBikePicks: 1,
      rank: 1,
      totalPoints: 1,
      user: 1,
      league: 1,
      smallBikePicks: 1,
      week: 0,
      _id: 0,
    })
    .toArray();
    console.log({  currentRoumdQuery, currentRound })

    const leagues = await Promise.all(
      (user.leagues || [])
        .map(async (league) => {
          const picks = await db
            .collection("picks")
            .find({ league })
            .toArray()
          return picks;
        })
      );
    

    user.leaguePicks = leagues.map(leaguePick => {
      return leaguePick.reduce(compileLeaguePicks, {}) || null;
    })
    user.currentRound = currentRound?.length ? currentRound[0] : currentRound;
    user.history = userHistory.reduce(compileLeaguePicks, {});
    console.log({ user })
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log({ error });
    const { email } = req.query;

    return res.status(200).json({
      success: false,
      message: "failure",
      emailUsed: email,
      error,
    });
  }
};
