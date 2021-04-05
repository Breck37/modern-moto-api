import connectToDatabase from './utils/connectToDatabase';
import lapsMapper from './utils/helpers/laps-mapper';

const getFastestLap = (results) => {
    const fastestLaps = lapsMapper(results);
    if(Array.isArray(fastestLaps) && fastestLaps.length) {
        return { ...fastestLaps[0], position: 100 };
    }
     return null
}

const filterAndGetApplicableResults = (results, fastestLap) => {
    const applicableResults = results.filter(result => [1,2,3,4,5,10].includes(result.position));
    applicableResults.push(fastestLap);
    return applicableResults;
}

const pointValues = {
    same: 10,
    different: 5,
    kicker: 20
}

const calculateTotal = (userPicks) => {
  return userPicks.reduce((total, currentPick) => total += currentPick.points, 0);
}

const checkSame = (userPick, topFive) => {
  return topFive.find(result => result.riderName.trim() === userPick.riderName.trim() && result.position === userPick.position);
}

const checkDifferent = (userPick, topFive) => {
  return topFive.find(result => result.riderName.trim() === userPick.riderName.trim() && result.position !== userPick.position);
}

const checkKickers = (userPick, kickers) => {
  return kickers.find(result => result.riderName.trim() === userPick.riderName.trim() && result.position === userPick.position);
}

const calculatePointsForUserPicks = (applicableResults) => {
    return (userPicks) => {
        const picksToCalculate = { ...userPicks };

        const updatedPicks = userPicks.bigBikePicks.map((pick) => {
            const isKickerPick = pick.position === 10 || pick.position === 100;

            const topFive = applicableResults.filter(result => result.position !== 10 && result.position !== 100);

            const kickers = applicableResults.filter(result => result.position === 10 || result.position === 100);

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
            hasBeenEquated: true
        }
    }
}

module.exports = async (req, res) => {
    const { week } = req.query;
    const { raceResults } = req.body;

    const db = await connectToDatabase(process.env.MONGO_URI);

    const currentWeekPicks = await db.collection('picks').find({ week: parseInt(week), hasBeenEquated: false }).project({ user: 1, bigBikePicks: 1, league: 1, totalPoints: 1 }).toArray();

    // save race results to DB
    await db.collection('results').updateOne({ week }, { $set: {raceResults, week} }, { upsert: true });

    if (
        !currentWeekPicks || 
        (Array.isArray(currentWeekPicks) && !currentWeekPicks.length)
        ) {
        res.status(200).json({ success: true, currentWeekPicks, message: 'No Picks To Calculate' });
    }

    const fastestLap = getFastestLap(raceResults);
    const applicableResults = filterAndGetApplicableResults(raceResults, fastestLap);

    const equateWeeksPoints = calculatePointsForUserPicks(applicableResults);

    const calculatedPicks = currentWeekPicks.map(equateWeeksPoints);

    // Save Calculated Picks
    await calculatedPicks.map(async (pick) => {
        const { bigBikePicks, totalPoints, hasBeenEquated } = pick;
        await db.collection('picks').updateOne(
            { _id: pick._id }, 
            {
                $set: {
                    bigBikePicks,
                    totalPoints,
                    hasBeenEquated
                }
            }
        )
    });

    res.status(200).json({ success: true, currentWeekPicks, calculatedPicks, applicableResults, message: 'Picks Calculated!' });
}