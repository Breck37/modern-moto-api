import connectToDatabase from "./utils/connectToDatabase";

module.exports = async (req, res) => {
  const {
    email,
    user,
    bigBikePicks,
    smallBikePicks = [],
    week,
    league = "League of Extraordinary Bros",
    type,
    season,
    round
  } = req.body;

  if (!Array.isArray(bigBikePicks) || !bigBikePicks.length) {
    res.status(200).json({ success: false, message: "No picks to save!" });
  }

  const db = await connectToDatabase(process.env.MONGO_URI);

  const formattedUserPicks = {
    user,
    email,
    week,
    round,
    year: new Date().getFullYear(),
    bigBikePicks,
    smallBikePicks,
    totalPoints: 0,
    hasBeenEquated: false,
    league,
    type,
    season,
    rank: null,
    created_at: new Date(),
  };

  await db
    .collection("picks")
    .replaceOne({ email, week, type, season }, formattedUserPicks, { upsert: true });

  res.status(200).json({ success: true, bigBikePicks, email, week });
};
