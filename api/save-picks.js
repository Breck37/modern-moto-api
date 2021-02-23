import connectToDatabase from './utils/connectToDatabase';

module.exports = async (req, res) => {
    const { email, picks, week } = req.query;
    console.log(picks, req.body, req.query)
    const db = await connectToDatabase(process.env.MONGO_URI);

    const formattedUserPicks = {
        email,
        week,
        picks,
        totalPoints: 0
    }

    const weeklyPicks = await db.collection('picks').insertOne(formattedUserPicks)

    console.log(weeklyPicks)

    res.status(200).json({ success: true, userPicks })
}
