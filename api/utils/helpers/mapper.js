// const object = {
//   POS: [],
//   number: [],
//   RIDER: [],
//   HOMETOWN: [],
//   BIKE: [],
//   QUAL: [],
//   HOLESHOT: [],
//   START: [],
//   "LAPS LED": [],
//   FINISH: [],
//   POINTS: [],
// };

const manufacturers = [
  "Suzuki",
  "Honda",
  "KTM",
  "Yamaha",
  "Kawasaki",
  "Yamaha",
];

const parsename = (name) => {
  const splitName = name.split(" ");
  let parsedName;
  splitName.map((nameElement) => {
    manufacturers.map((m) => {
      const reg = new RegExp(m, "gi");
      const replacedBike = nameElement.replace(reg, " ");
      if (nameElement.length > replacedBike.length) {
        parsedName = replacedBike;
      }
    });
  });
  return (splitName[0] += ` ${parsedName}`);
};

const splitRiderResults = (rider, position) => {
  return {
    number: rider[0],
    name: parsename(rider[1]),
    points: rider[2],
    position,
  };
};

const identifyRiderRaceResults = (results) => {
  let currentRider = [];
  let riderResults = [];

  results.map((c, i) => {
    if (currentRider.length == 4) {
      riderResults.push(splitRiderResults(currentRider, i / 4));
      currentRider = [];
    } else if (i === results.length - 1) {
      riderResults.push(splitRiderResults([...currentRider, c], (i + 1) / 4));
      currentRider = [];
    }
    currentRider.push(c);
  });
  return riderResults;
};

module.exports = (resultString) => {
  return identifyRiderRaceResults(resultString);
};
