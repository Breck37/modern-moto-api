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

const compileLeaguePicks = (leaguePicks, currentPick) => {
  if (leaguePicks[currentPick.week]) {
    leaguePicks[currentPick.week].push(currentPick);
  } else {
    leaguePicks[currentPick.week] = [currentPick];
  }
  console.log({
    leaguePicks,
    currentPick,
  });
  return leaguePicks;
};

const sortLeaguePicks = (pickArray) => {
  if (!Array.isArray(pickArray) || !pickArray.length) {
    return [];
  }
  return [
    pickArray[0],
    pickArray[1].sort((a, b) => b.totalPoints - a.totalPoints),
  ];
};

module.exports = async (req, res) => {
  const { email, week } = req.query;
  const db = await connectToDatabase(process.env.MONGO_URI);

  let user = await db.collection("users").findOne({ email });
  console.log({ user, email });
  const picks = await db
    .collection("picks")
    .find(
      { user: user.username },
      {
        bigBikePicks: 1,
        rank: 1,
        totalPoints: 1,
        user: 1,
        league: 0,
        smallBikePicks: 0,
        week: 0,
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

    const sortedLeaguePicks =
      Object.fromEntries(
        Object.entries(leaguePicks.reduce(compileLeaguePicks, {})).map(
          sortLeaguePicks
        )
      ) || null;
    console.log({ sortedLeaguePicks });
    user.leaguePicks = sortedLeaguePicks;
  }

  if (!user || (Array.isArray(user) && !user.length)) {
    user = await createUser(db, { email });
    if (user.success === false) {
      return res.status(200).json({
        success: false,
        message: "error saving user",
        user: user.email,
      });
    }
  }

  return res.status(200).json({ success: true, user: { ...user, picks } });
};
