import connectToDatabase from "./utils/connectToDatabase";

module.exports = async (req, res) => {
  const {
    email,
    user,
    bigBikePicks,
    smallBikePicks = [],
    week,
    league = "",
  } = req.body;

  const db = await connectToDatabase(process.env.MONGO_URI);
  console.log({
    body: req.body,
  });
  const formattedUserPicks = {
    user,
    email,
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
  // await db.collection("picks").insertOne(formattedUserPicks);
  await db
    .collection("picks")
    .replaceOne({ email, week }, formattedUserPicks, { upsert: true });

  res.status(200).json({ success: true, bigBikePicks, email, week });
};
