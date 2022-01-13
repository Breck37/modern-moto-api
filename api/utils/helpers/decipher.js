export const decipher = (picks, currentPick) => {
  let finalPicks = picks;
  try {
    const keysLength = finalPicks ? Object.keys(finalPicks)?.length : null;
    if (!keysLength) {
      finalPicks = {
        [currentPick.league]: {
          [currentPick.year]: {
            [currentPick.type]: {
              [currentPick.week]: [currentPick],
            },
          },
        }
      }
    } else if (!finalPicks[currentPick.league]) {
      finalPicks = {
        ...finalPicks,
        [currentPick.league]: {
          [currentPick.year]: {
            [currentPick.type]: {
              [currentPick.week]: [currentPick],
            },
          },
        }
      }
    } else if (!finalPicks[currentPick.league][currentPick.year]) {
      finalPicks[currentPick.league][currentPick.year] = {
        [currentPick.type]: {
          [currentPick.week]: [currentPick],
        },
      };
    } else if (!finalPicks[currentPick.league][currentPick.year][currentPick.type]) {
      finalPicks[currentPick.league][currentPick.year][currentPick.type] = {
        [currentPick.week]: [currentPick],
      };
    } else if (!finalPicks[currentPick.league][currentPick.year][currentPick.type][currentPick.week]) {
      finalPicks[currentPick.league][currentPick.year][currentPick.type][currentPick.week] = [currentPick]
    } else {
      finalPicks[currentPick.league][currentPick.year][currentPick.type][currentPick.week].concat(currentPick)
    }
  } catch (error) {
    console.log('REDUCE ERROR decipher', error);
    return finalPicks;
  }
  return finalPicks;
}

