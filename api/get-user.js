const connectToDatabase = require("./utils/connectToDatabase");

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

const compileLeaguePicks = (leaguePicks, currentPick) => {
  if (leaguePicks[currentPick.year] && leaguePicks[currentPick.year][currentPick.type] && leaguePicks[currentPick.year][currentPick.type][`week${currentPick.week}`]) {
    leaguePicks[currentPick.year][currentPick.type][`week${currentPick.week}`].push(currentPick);
    leaguePicks[currentPick.year][currentPick.type][`week${currentPick.week}`].sort((a, b) => b.totalPoints - a.totalPoints)
  } else if (leaguePicks[currentPick.year] && leaguePicks[currentPick.year][currentPick.type]) {
    leaguePicks[currentPick.year][currentPick.type][`week${currentPick.week}`] = [currentPick]
  } else if (leaguePicks[currentPick.year]) {
    leaguePicks[currentPick.year][currentPick.type] = {
      [`week${currentPick.week}`]: [currentPick]
    }
  } else {
    leaguePicks = {
      ...leaguePicks,
      [currentPick.year]: {
        [currentPick.type]: {
          [`week${currentPick.week}`]: [currentPick]
        }
      }
    }
  }
  return leaguePicks;
};

module.exports = async (req, res) => {
  console.log('HIT GET USER')
  try {
    const {
      email,
      week,
      type,
      league
    } = req.query;

    console.log('QUERY', {
      email,
      week,
      type,
      league
    })

    if (!email) {
      return res.status(200).json({
        success: false,
        message: "email",
        emailUsed: email
      });
    }

    const db = await connectToDatabase.default(process.env.MONGO_URI);

    let user = await db.collection("users").findOne({ email });
    console.log('IN GET', { user, req: req.query })

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "db",
        user,
        emailUsed: email
      });
    }
    const userHistoryQuery = { user: user.username };

    const userHistory = await db.collection("picks").find(userHistoryQuery).toArray();

    const currentRoumdQuery = { ...userHistoryQuery, type, week };

    console.log({ userHistory: userHistory[0] })
    const currentRound = await db
      .collection("picks")
      .find(
        currentRoumdQuery,
        {
          bigBikePicks: 1,
          rank: 1,
          totalPoints: 1,
          user: 1,
          league: 1,
          smallBikePicks: 1,
          week: 0,
          _id: 0
        }
      )
      .toArray();
      console.log({ currentRound })

      const query = { league: league ?? currentRound[0].league, week, type };

      const leaguePicks = await db
        .collection("picks")
        .find(query, {
          bigBikePicks: 1,
          rank: 1,
          totalPoints: 1,
          user: 1,
          league: 0,
          smallBikePicks: 0,
          week: 0,
        })
        .toArray();
        console.log({ leaguePicks })

      user.leaguePicks = leaguePicks.reduce(compileLeaguePicks, {}) || null;
      user.currentRound = currentRound;
      user.history = userHistory;

      console.log({ user })
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log({ error })
    const {
      email,
    } = req.query;

    return res.status(200).json({
      success: false,
      message: "failure",
      emailUsed: email,
      error
    })
  }
};
