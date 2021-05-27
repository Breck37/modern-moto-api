import connectToDatabase from "./utils/connectToDatabase";

module.exports = async (req, res) => {
    const db = await connectToDatabase(process.env.MONGO_URI);

    const results = await db.collection('results').find().toArray();

    return results;
} 