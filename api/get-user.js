import connectToDatabase from "./utils/connectToDatabase";

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
  if (leaguePicks[currentPick.season] && leaguePicks[currentPick.season][currentPick.type] && leaguePicks[currentPick.season][currentPick.type][`week${currentPick.week}`]) {
    leaguePicks[currentPick.season][currentPick.type][`week${currentPick.week}`].push(currentPick);
    leaguePicks[currentPick.season][currentPick.type][`week${currentPick.week}`].sort((a, b) => b.totalPoints - a.totalPoints)
  } else if (leaguePicks[currentPick.season] && leaguePicks[currentPick.season][currentPick.type]) {
    leaguePicks[currentPick.season][currentPick.type][`week${currentPick.week}`] = [currentPick]
  } else if (leaguePicks[currentPick.season]) {
    leaguePicks[currentPick.season][currentPick.type] = {
      [`week${currentPick.week}`]: [currentPick]
    }
  } else {
    leaguePicks = {
      ...leaguePicks,
      [currentPick.season]: {
        [currentPick.type]: {
          [`week${currentPick.week}`]: [currentPick]
        }
      }
    }
  }
  return leaguePicks;
};

// const sortLeaguePicks = (pickArray) => {
//   console.log({ pickArray })
//   if (!Array.isArray(pickArray) || !pickArray.length) {
//     return [];
//   }

//   const sortedPicks = Object.entries(pickArray[1]).map(entry => {
//     return {
//       [entry[0]]: Object.f
//     }
//   }).sort((a, b) => b.totalPoints - a.totalPoints)

//   return {
//     [Object.keys(pickArray)[0]]: {

//     },
//   };
// };

module.exports = async (req, res) => {
  const {
    email,
    week,
    // type 
  } = req.query;
  const db = await connectToDatabase(process.env.MONGO_URI);

  let user = await db.collection("users").findOne({ email });

  // if (!user || (Array.isArray(user) && !user.length)) {
  //   return res.status(200).json({
  //     success: false,
  //     message: "error saving user",
  //     user,
  //     emailUsed: email
  //   });
  // }
  if (!user) {
    return;
  }

  const pickQuery = { user: user.username };


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

    const sortedLeaguePicks = leaguePicks.reduce(compileLeaguePicks, {}) || null;

    user.picks = picks
    user.leaguePicks = sortedLeaguePicks;
  }

  return res.status(200).json({ success: true, user });
};
