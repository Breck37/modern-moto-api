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

    const userPicks = await db.collection('picks').insertOne(formattedUserPicks)

    console.log(userPicks)

    res.status(200).json({ success: true, userPicks, picks, email, week })
}
