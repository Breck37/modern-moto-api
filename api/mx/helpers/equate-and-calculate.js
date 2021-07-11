import {
  assignRankings,
  calculatePointsForUserPicks,
  filterAndGetApplicableResults,
} from "./utilities";

module.exports = (raceResults, picksToCalculate) => {
  console.log(
    "HIT organizePicks",
    assignRankings,
    calculatePointsForUserPicks,
    filterAndGetApplicableResults
  );
  return { };
  //  const fastestLap = raceResults.liveResults.fastestLaps
  //   ? {
  //     ...raceResults.liveResults.fastestLaps[0],
  //     name: raceResults.liveResults.fastestLaps[0].riderName,
  //     number: raceResults.liveResults.fastestLaps[0].number,
  //     position: 100,
  //   }
  //   : null;
  // const applicableResults = filterAndGetApplicableResults(
  //   raceResults.liveResults.raceResults,
  //   fastestLap
  // );

  // const equateWeeksPoints = calculatePointsForUserPicks(applicableResults);

  // const calculatedPicks = assignRankings(
  //   currentWeekPicks.map(equateWeeksPoints)
  // );

  //   return {
  //     applicableResults,
  //     calculatedPicks
  //   }
};
