import connectToDatabase from "./utils/connectToDatabase";

module.exports = async (req, res) => {
  const {
    email,
    bigBikePicks = [],
    smallBikePicks = [],
    week,
    league = "League of Extraordinary Bros",
    type,
    year = new Date().getFullYear(),
    deadline,
  } = JSON.parse(req.body);

  if ((!Array.isArray(bigBikePicks) || !bigBikePicks.length) && (!Array.isArray(smallBikePicks) || !smallBikePicks.length)) {
    res.status(200).json({ success: false, message: "No picks to save!" });
  }

  const db = await connectToDatabase(process.env.MONGO_URI);

  const formattedUserPicks = {
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
    deadline,
    created_at: new Date().toLocaleString('en-US', { timeZone: 'America/Phoenix' }),
  };

  await db
    .collection("picks")
    .replaceOne({ email, week, type, year }, formattedUserPicks, { upsert: true });

  res.status(200).json({ success: true, bigBikePicks, smallBikePicks, email, week });
};
