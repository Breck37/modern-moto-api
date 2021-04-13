import connectToDatabase from "./utils/connectToDatabase";

module.exports = async (req, res) => {
  const {
    email,
    bigBikePicks,
    smallBikePicks = [],
    week,
    league = "",
  } = req.body;

  const db = await connectToDatabase(process.env.MONGO_URI);

  const formattedUserPicks = {
    user: email,
    week,
    year: new Date().getFullYear(),
    bigBikePicks,
    smallBikePicks,
    totalPoints: 0,
    hasBeenEquated: false,
    league,
    rank: null,
    created_at: new Date(),
  };
  console.log({ formattedUserPicks });
  await db.collection("picks").insertOne(formattedUserPicks);

  res.status(200).json({ success: true, bigBikePicks, email, week });
};
