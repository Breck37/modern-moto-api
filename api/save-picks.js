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
    year = new Date().getFullYear()
  } = req.body;

  if (!Array.isArray(bigBikePicks) || !bigBikePicks.length) {
    res.status(200).json({ success: false, message: "No picks to save!" });
  }

  const db = await connectToDatabase(process.env.MONGO_URI);

  const formattedUserPicks = {
    user,
    email,
    week,
    year,
    bigBikePicks,
    smallBikePicks,
    totalPoints: 0,
    hasBeenEquated: false,
    league,
    type,
    rank: null,
    created_at: new Date(),
  };

  await db
    .collection("picks")
    .replaceOne({ email, week, type, year }, formattedUserPicks, { upsert: true });

  res.status(200).json({ success: true, bigBikePicks, email, week });
};
