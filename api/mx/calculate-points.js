import connectToDatabase from "../utils/connectToDatabase";
import { equateAndCalculate } from "./helpers";

module.exports = async (req, res) => {
  const { week, type } = req.query;
  const { raceResults, fastLapResults } = req.body;

  const db = await connectToDatabase(process.env.MONGO_URI);

  const currentWeekPicks = await db
    .collection("picks")
    .find({ week: parseInt(week), hasBeenEquated: false, type })
    .project({ user: 1, bigBikePicks: 1, league: 1, totalPoints: 1 })
    .toArray();


  // if (
  //   !currentWeekPicks ||
  //   (Array.isArray(currentWeekPicks) && !currentWeekPicks.length)
  // ) {
  //   res.status(200).json({
  //     success: true,
  //     currentWeekPicks,
  //     message: "No Picks To Calculate",
  //   });
  //   return;
  // }

  const { calculatedPicks, applicableResults } = equateAndCalculate(
    raceResults,
    currentWeekPicks
  );

  if (!calculatedPicks || !applicableResults) {
    res.status(200).json({
      success: false,
      currentWeekPicks,
      calculatedPicks, 
      applicableResults,
      message: "Unable to calculate picks",
    });
    return;
  }

    // save race results to DB
    // await db
    //   .collection("results")
    //   .updateOne({ week, type }, { $set: { raceResults: applicableResults, week } }, { upsert: true });

  // Save Calculated Picks
  // await Promise.all(
  //   await calculatedPicks.map(async (pick) => {
  //     const { bigBikePicks, totalPoints, hasBeenEquated, rank } = pick;
  //     const updatedPick = await db.collection("picks").updateOne(
  //       { _id: pick._id },
  //       {
  //         $set: {
  //           bigBikePicks,
  //           totalPoints,
  //           hasBeenEquated,
  //           rank,
  //         },
  //       }
  //     );
  //     return updatedPick;
  //   })
  // );

  res.status(200).json({
    success: true,
    currentWeekPicks,
    calculatedPicks,
    applicableResults,
    message: "Picks Calculated!",
  });
};
