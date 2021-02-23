import connectToDatabase from './utils/connectToDatabase';

module.exports = async (req, res) => {
    console.log('HIHIHIT')
    const { email, picks, week } = req.body;
    console.log(picks, req.body, req.query)
    const db = await connectToDatabase(process.env.MONGO_URI);

    const formattedUserPicks = {
        email,
        week,
        picks,
        totalPoints: 0
    }

    await db.collection('picks').insertOne(formattedUserPicks)

    res.status(200).json({ success: true, picks, email, week })
}
