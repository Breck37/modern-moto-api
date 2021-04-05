import connectToDatabase from './utils/connectToDatabase';

module.exports = async (req, res) => {
    const { week, raceResults } = req.query;

    const db = await connectToDatabase(process.env.MONGO_URI);

    const currentWeekPicks = await db.collection('picks').find({ week }).toArray();

    console.log({ currentWeekPicks });

    res.status(200).json({ success: true, currentWeekPicks });
}