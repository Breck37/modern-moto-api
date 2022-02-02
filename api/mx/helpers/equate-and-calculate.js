import {
  assignRankings,
  calculatePointsForUserPicks,
  filterAndGetApplicableResults
} from "./utilities";
const util = require("util");

module.exports = (pdfResults, picksToCalculate) => {
  let calculatedPicks = {};

  if (
    !pdfResults ||
    !Array.isArray(picksToCalculate) ||
    !picksToCalculate.length
  ) {
    return calculatedPicks;
  }

  const { raceResults, fastLapResults } = pdfResults;

  const bigBikeFastestLaps = Object.entries(fastLapResults).reduce(
    (acc, [key, value]) => {
      if (key === "bigBikeLapTimesMoto1") {
        acc.push({
          ...value[0],
          name: value[0].name,
          position: 101,
        });
      }
      if (key === "bigBikeLapTimesMoto2") {
        acc.push({
          ...value[0],
          name: value[0].name,
          position: 102,
        });
      }
      return acc;
    },
    []
  );
  const smallBikeFastestLaps = Object.entries(fastLapResults).reduce(
    (acc, [key, value]) => {
      if (key === "smallBikeLapTimesMoto1") {
        acc.push({
          ...value[0],
          name: value[0].name,
          position: 101,
        });
      }
      if (key === "smallBikeLapTimesMoto2") {
        acc.push({
          ...value[0],
          name: value[0].name,
          position: 102,
        });
      }
      return acc;
    },
    []
  );

  const bigBikeapplicableResults = filterAndGetApplicableResults(
    raceResults.big,
    bigBikeFastestLaps
  );

  const smallBikeapplicableResults = filterAndGetApplicableResults(
    raceResults.small,
    smallBikeFastestLaps
  );



  const equateBigBikePoints = calculatePointsForUserPicks(bigBikeapplicableResults, 'bigBikePicks', 'bigBikePoints');
  const equateSmallBikePoints = calculatePointsForUserPicks(smallBikeapplicableResults, 'smallBikePicks', 'smallBikePoints');

  calculatedPicks = assignRankings(
    picksToCalculate.map(equateBigBikePoints).map(equateSmallBikePoints)
  );

  const applicableResults = {
    big: bigBikeapplicableResults,
    small: smallBikeapplicableResults,
  }

    return {
      applicableResults,
      calculatedPicks
    }
};
