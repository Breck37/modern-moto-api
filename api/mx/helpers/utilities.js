// const getApplicableFastestLaps = 

export const filterAndGetApplicableResults = (results, fastestLaps = []) => {
  const applicableResults = results.filter((result) => {
    if (!result) return false;
    return [1, 2, 3, 4, 5, 10].includes(result.position || results.overall);
  });
  applicableResults.push(...fastestLaps);
  return applicableResults;
};

export const pointValues = {
  same: 10,
  different: 5,
  kicker: 20,
};

export const calculateTotal = (userPicks) => {
  return userPicks.reduce(
    (total, currentPick) => (total += currentPick.points),
    0
  );
};

export const checkSame = (userPick, topFive) => {
  return topFive.find(
    (result) =>
      result.riderName.trim() === userPick.riderName.trim() &&
      result.position === userPick.position
  );
};

export const checkDifferent = (userPick, topFive) => {
  return topFive.find(
    (result) =>
      result.riderName.trim() === userPick.riderName.trim() &&
      result.position !== userPick.position
  );
};

export const checkKickers = (userPick, kickers) => {
  return kickers.find(
    (result) =>
      result.riderName.trim() === userPick.riderName.trim() &&
      result.position === userPick.position
  );
};

export const calculatePointsForUserPicks = (applicableResults, pickType) => {
  return (userPicks) => {
    const picksToCalculate = { ...userPicks };

    const updatedPicks = userPicks[pickType].map((pick) => {
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
      [pickType]: updatedPicks,
      totalPoints: picksToCalculate.totalPoints + calculateTotal(updatedPicks),
      hasBeenEquated: false,
    };
  };
};

export const assignRankings = (currentPicks) => {
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