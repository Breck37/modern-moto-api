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
  try {
    const {
      email,
      week,
      type 
    } = req.query;

    if (!email) {
      return res.status(200).json({
        success: false,
        message: "email",
        emailUsed: email
      });
    }

    console.log('CONNECT', { connectToDatabase })

    const db = await connectToDatabase(process.env.MONGO_URI);

    let user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "db",
        user,
        emailUsed: email
      });
    }

    const pickQuery = { user: user.username };

    if (type) {
      pickQuery.type = type;
    }

    const picks = await db
      .collection("picks")
      .find(
        pickQuery,
        {
          bigBikePicks: 1,
          rank: 1,
          totalPoints: 1,
          user: 1,
          league: 1,
          smallBikePicks: 0,
          week: 0,
          _id: 0
        }
      )
      .toArray();

    if (Array.isArray(picks) && picks.length && picks[0].league) {
      const query = { league: picks[0].league };

      if (week) {
        query.week = parseInt(week);
      }

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

      user.leaguePicks = leaguePicks.reduce(compileLeaguePicks, {}) || null;;
      user.picks = picks
    }


    return res.status(200).json({ success: true, user });
  } catch (error) {
    const {
      email,
    } = req.query;
    console.log({ error })

    return res.status(200).json({
      success: false,
      message: "failure",
      emailUsed: email,
      error
    })
  }
};
