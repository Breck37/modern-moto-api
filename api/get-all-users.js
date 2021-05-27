import connectToDatabase from "./utils/connectToDatabase";

module.exports = async (req, res) => {
    const db = await connectToDatabase(process.env.MONGO_URI);

    const users = await db.collection('users').find().toArray();

    return users;
} 