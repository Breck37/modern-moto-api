import connectToDatabase from './utils/connectToDatabase';

module.exports = async (req, res) => {
    const { email, bigBikePicks, week, league = "" } = req.body;

    const db = await connectToDatabase(process.env.MONGO_URI);

    const formattedUserPicks = {
        user: email,
        week,
        year: new Date().getFullYear(),
        bigBikePicks,
        totalPoints: bigBikePicks.reduce((total, currentPick) => total += currentPick.points, 0),
        hasBeenEquated: false,
        league,
        created_at: new Date()
    }

    await db.collection('picks').insertOne(formattedUserPicks)

    res.status(200).json({ success: true, bigBikePicks, email, week })
}
