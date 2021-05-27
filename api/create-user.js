import connectToDatabase from "./utils/connectToDatabase";

module.exports = async ({ email }) => {
  if (!email) {
    return { success: false, email };
  }

  const db = await connectToDatabase(process.env.MONGO_URI);

  const baseUser = {
    archived: false,
    email,
    username: email?.split("@")[0],
    currentMode: 1,
    leagues: [],
    weeklyResults: [],
  };

  const result = await db.collection("users").insertOne(baseUser);

  return result;
};