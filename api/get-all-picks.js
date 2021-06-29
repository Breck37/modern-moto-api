import connectToDatabase from "./utils/connectToDatabase";

module.exports = async (req, res) => {
    const { query = {} } = req;
    let pickQuery = {};
    const db = await connectToDatabase(process.env.MONGO_URI);

    if (query && query.type) {
        pickQuery.type = query.type;
    }

    const picks = await db.collection('picks').find(pickQuery).toArray();

    res.status(200).send(picks)
}