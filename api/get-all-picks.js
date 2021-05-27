import connectToDatabase from "./utils/connectToDatabase";

module.exports = async (req, res) => {
    const db = await connectToDatabase(process.env.MONGO_URI);

    const picks = await db.collection('picks').find().toArray();

    return picks;
} 