function add60(lapTime) {
  if (lapTime.length === 3) {
    const minutesToAdd = 60 * parseFloat(lapTime[0]);
    return [minutesToAdd + parseFloat(lapTime[1]), lapTime[2]];
  }

  return lapTime;
}

const testMinutes = (riderObjects) => {
  const hasMinuteTimes = riderObjects.filter((lt) => lt.bestLap.includes(":"))
    .length;

  if (hasMinuteTimes) {
    return riderObjects.map((lt) => {
      const a = lt.bestLap.replace(":", ".").split(".");
      return {
        ...lt,
        bestLap: add60(a).join("."),
      };
    });
  }

  return riderObjects;
};

const formatTime = (riderWithLapTime) => {
  if (riderWithLapTime.bestLap > 60) {
    const splitLap = riderWithLapTime.bestLap.split(".");
    const minutes = Math.floor(splitLap[0] / 60);
    const diff = (parseFloat(riderWithLapTime.bestLap) - 60 * minutes).toFixed(
      3
    );

    return {
      ...riderWithLapTime,
      rider: riderWithLapTime.riderName.trim(),
      lap: `${minutes}:${diff.split(".")[0].length === 1 ? "0" : ""}${diff}`,
      bike: riderWithLapTime.bike.split(" ")[0],
    };
  }

  return {
    ...riderWithLapTime,
    rider: riderWithLapTime.riderName.trim(),
    lap: riderWithLapTime.bestLap,
    bike: riderWithLapTime.bike.split(" ")[0],
  };
};

const sortRidersByLapTimes = (a, b) => {
  if (a.bestLap === b.bestLap) {
    return 0;
  }
  const aArr = a.bestLap.split("."),
    bArr = b.bestLap.split(".");
  for (let i = 0; i < Math.min(aArr.length, bArr.length); i++) {
    if (parseInt(aArr[i]) < parseInt(bArr[i])) {
      return -1;
    }
    if (parseInt(aArr[i]) > parseInt(bArr[i])) {
      return 1;
    }
  }
  if (aArr.length < bArr.length) {
    return -1;
  }
  if (aArr.length > bArr.length) {
    return 1;
  }
  return 0;
};

module.exports = (raceResults) => {
  if (!raceResults || !raceResults.length) return [];

  return testMinutes(raceResults).sort(sortRidersByLapTimes).map(formatTime);
};
