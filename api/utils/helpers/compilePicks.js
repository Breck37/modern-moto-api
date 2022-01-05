const { decipher } = require('./decipher');

export const compileLeaguePicks = (leaguePicks, currentPicks) => {
  let picks = leaguePicks ?? {};
  console.log({ currentPicks })
  if (Array.isArray(currentPicks)) {
    currentPicks.map((currentPick) => {
      if (Array.isArray(currentPick)) {
        currentPick.map((currentPick) => {
          picks = decipher(picks, currentPick);
        });
      } else {
        const currentPick = currentPicks;
        picks = decipher(picks, currentPick);
      }
    });
  } else {
    const currentPick = currentPicks;
    picks = decipher(picks, currentPick);
  }
  return picks;
};