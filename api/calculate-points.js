import connectToDatabase from "../utils/connectToDatabase";

const filterAndGetApplicableResults = (results, fastestLap) => {
  const applicableResults = results.filter((result) => {
    if (!result) return false;
    return [1, 2, 3, 4, 5, 10].includes(result.position || results.overall);
  });
  applicableResults.push(fastestLap);
  return applicableResults;
};

const pointValues = {
  same: 10,
  different: 5,
  kicker: 20,
};

const calculateTotal = (userPicks) => {
  return userPicks.reduce(
    (total, currentPick) => (total += currentPick.points),
    0
  );
};

const checkSame = (userPick, topFive) => {
  if (!userPick) return false;
  return topFive.filter(Boolean).find(
    (result) => result.name.trim() === userPick.name.trim() &&
      result.position === userPick.position
  );
};

const checkDifferent = (userPick, topFive) => {
  if (!userPick) return false;
  return topFive.filter(Boolean).find(
    (result) => result.name.trim() === userPick.name.trim() &&
      result.position !== userPick.position
  );
};

const checkKickers = (userPick, kickers) => {
  if (!userPick) return false;
  return kickers.filter(Boolean).find(
    (result) => result.name.trim() === userPick.name.trim() &&
      result.position === userPick.position
  );
};

const calculatePointsForUserPicks = (applicableResults) => {
  return (userPicks) => {
    const picksToCalculate = { ...userPicks };

    const updatedPicks = userPicks.bigBikePicks.map((pick) => {
      const isKickerPick = pick.position === 10 || pick.position === 100;

      const topFive = applicableResults
        .filter(Boolean)
        .filter((result) => result.position !== 10 && result.position !== 100);

      const kickers = applicableResults
        .filter(Boolean)
        .filter((result) => result.position === 10 || result.position === 100);

      if (!isKickerPick && checkSame(pick, topFive)) {
        return { ...pick, points: pointValues.same };
      } else if (!isKickerPick && checkDifferent(pick, topFive)) {
        return { ...pick, points: pointValues.different };
      } else if (checkKickers(pick, kickers)) {
        return { ...pick, points: pointValues.kicker };
      }
      return pick;
    });

    return {
      ...picksToCalculate,
      bigBikePicks: updatedPicks,
      totalPoints: calculateTotal(updatedPicks),
      hasBeenEquated: false,
    };
  };
};

const assignRankings = (currentPicks) => {
  const rankText = {
    1: "st",
    2: "nd",
    3: "rd",
    4: "th",
    5: "th",
    6: "th",
    7: "th",
    8: "th",
    9: "th",
    0: "th",
    tied: " (Tied)",
  };

  const sortedPicks = currentPicks.sort(
    (a, b) => b.totalPoints - a.totalPoints
  );

  return sortedPicks.map((pick, i, arr) => {
    let rank = i + 1;
    const isAForwardTie = Boolean(
      arr[i + 1] && pick.totalPoints === arr[i + 1].totalPoints
    );
    const isABackwardsTie = Boolean(
      arr[i - 1] && pick.totalPoints === arr[i - 1].totalPoints
    );

    if (isABackwardsTie) {
      rank -= 1;
    }

    if (rank.length > 1) {
      rank = rank += rankText[rank[rank.length - 1]];
    } else {
      rank = rank += rankText[rank];
    }

    return {
      ...pick,
      rank: `${rank + (isAForwardTie || isABackwardsTie ? rankText.tied : "")}`,
    };
  });
};

module.exports = async (req, res) => {
  const { week, type, season } = req.query;
  const { raceResults } = req.body;

  const db = await connectToDatabase(process.env.MONGO_URI);

  const currentWeekPicks = await db
    .collection("picks")
    .find({ week: parseInt(week), hasBeenEquated: false, type })
    .project({ user: 1, bigBikePicks: 1, league: 1, totalPoints: 1 })
    .toArray();
  let fastestLap = null;

  const fastestLap = raceResults.fastestLaps ? {
        ...raceResults.fastestLaps[0],
        name: raceResults.fastestLaps[0].name,
        position: 100,
      } : null;

  // save race results to DB
  await db
    .collection("results")
    .updateOne({ week, type }, { $set: { raceResults, week, fastestLap, season } }, { upsert: true });

  if (
    !currentWeekPicks ||
    (Array.isArray(currentWeekPicks) && !currentWeekPicks.length)
  ) {
    res.status(200).json({
      success: true,
      currentWeekPicks,
      message: "No Picks To Calculate",
    });
    return;
  }

  const applicableResults = filterAndGetApplicableResults(
    raceResults.raceResults,
    fastestLap
  );

  const equateWeeksPoints = calculatePointsForUserPicks(applicableResults);

  const calculatedPicks = assignRankings(
    currentWeekPicks.map(equateWeeksPoints)
  );

  // Save Calculated Picks
  await Promise.all(
    await calculatedPicks.map(async (pick) => {
      const { bigBikePicks, totalPoints, rank } = pick;
      const updatedPick = await db.collection("picks").updateOne(
        { _id: pick._id },
        {
          $set: {
            bigBikePicks,
            totalPoints,
            hasBeenEquated: true,
            rank,
          },
        }
      );
      return updatedPick;
    })
  );

  res.status(200).json({
    success: true,
    currentWeekPicks,
    calculatedPicks,
    applicableResults,
    message: "Picks Calculated!",
  });
};
