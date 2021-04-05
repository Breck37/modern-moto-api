import connectToDatabase from './utils/connectToDatabase';

module.exports = async (req, res) => {
    const { week, raceResults } = req.query;

    const db = await connectToDatabase(process.env.MONGO_URI);

    const currentWeekPicks = await db.collection('picks').find({ week: parseInt(week) }).toArray();

    console.log({ currentWeekPicks, week });

    res.status(200).json({ success: true, currentWeekPicks });
}