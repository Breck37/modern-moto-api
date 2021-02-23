import connectToDatabase from './utils/connectToDatabase';

module.exports = async (req, res) => {
    console.log('HIHIHIT')
    const { email, bigBikePicks, week } = req.body;
    console.log({ picks: bigBikePicks, Body: req.body, query: req.query})
    const db = await connectToDatabase(process.env.MONGO_URI);

    const formattedUserPicks = {
        email,
        week,
        bigBikePicks,
        totalPoints: 0
    }

    await db.collection('picks').insertOne(formattedUserPicks)

    res.status(200).json({ success: true, bigBikePicks, email, week })
}
