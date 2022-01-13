const { compileLeaguePicks } = require("../api/utils/helpers/compilePicks");

const mockPicks = [
  [
    {
      _id: "603470d456e7320008be3de7",
      user: "Brent",
      week: 1,
      bigBikePicks: [
        {
          riderName: "Adam Ciancurulo",
          position: 1,
          points: 5,
        },
        {
          riderName: "Eli Tomac",
          position: 2,
          points: 0,
        },
        {
          riderName: "Chase Sexton",
          position: 3,
          points: 0,
        },
        {
          riderName: "Dylan Ferrandis",
          position: 4,
          points: 0,
        },
        {
          riderName: "Cooper Webb",
          position: 5,
          points: 0,
        },
        {
          riderName: "Dean Wilson",
          position: 10,
          points: 0,
        },
        {
          riderName: "Adam Ciancurulo",
          position: 100,
          points: 0,
        },
      ],
      totalPoints: 5,
      hasBeenEquated: true,
      league: "League of Extraordinary Bros",
      email: "brent.eckert7@gmail.com",
      type: "sx",
      year: 2021,
      bigBikePoints: 5,
      smallBikePoints: null,
      smallBikePicks: [],
      rank: "4th",
    },
    {
      _id: "60347a2f4e812e0008b9e9f6",
      user: "Brent",
      week: 2,
      bigBikePicks: [
        {
          riderName: "Adam Cianciarulo",
          position: 1,
          points: 0,
        },
        {
          riderName: "Zach Osborne",
          position: 2,
          points: 0,
        },
        {
          riderName: "Eli Tomac",
          position: 3,
          points: 5,
        },
        {
          riderName: "Ken Roczen",
          position: 4,
          points: 5,
        },
        {
          riderName: "Justin Barcia",
          position: 5,
          points: 0,
        },
        {
          riderName: "Joey Savatgy",
          position: 10,
          points: 0,
        },
        {
          riderName: "Zach Osborne",
          position: 100,
          points: 0,
        },
      ],
      totalPoints: 10,
      hasBeenEquated: true,
      league: "League of Extraordinary Bros",
      email: "brent.eckert7@gmail.com",
      type: "sx",
      year: 2021,
      bigBikePoints: 10,
      smallBikePoints: null,
      smallBikePicks: [],
      rank: "1st (Tied)",
    },
    {
      _id: "60347cf6fd37780009d5efa0",
      user: "Kyler",
      week: 1,
      bigBikePicks: [
        {
          riderName: "Ken Roczen",
          position: 5,
          points: 5,
        },
        {
          riderName: "Eli Tomac",
          position: 2,
          points: 0,
        },
        {
          riderName: "Chase Sexton",
          position: 3,
          points: 0,
        },
        {
          riderName: "Justin Barcia",
          position: 5,
          points: 5,
        },
        {
          riderName: "Jason Anderson",
          position: 5,
          points: 0,
        },
        {
          riderName: "Joey Savatgy",
          position: 10,
          points: 0,
        },
        {
          riderName: "Eli Tomac",
          position: 100,
          points: 0,
        },
      ],
      totalPoints: 10,
      hasBeenEquated: true,
      league: "League of Extraordinary Bros",
      email: "kyler.hopper@gmail.com",
      type: "sx",
      year: 2021,
      bigBikePoints: 10,
      smallBikePoints: null,
      smallBikePicks: [],
      rank: "2nd (Tied)",
    },
    {
      _id: "603eee68a59cad00096896b5",
      user: "Levi",
      week: 1,
      year: 2021,
      bigBikePicks: [
        {
          riderName: "Ken Roczen",
          position: 1,
          points: 5,
        },
        {
          riderName: "Adam Cianciarulo",
          position: 2,
          points: 5,
        },
        {
          riderName: "Eli Tomac",
          position: 3,
          points: 0,
        },
        {
          riderName: "Zach Osborne",
          position: 4,
          points: 0,
        },
        {
          riderName: "Cooper Webb",
          position: 5,
          points: 0,
        },
        {
          riderName: "Dean Wilson",
          position: 10,
          points: 0,
        },
        {
          riderName: "Cooper Webb",
          position: 100,
          points: 0,
        },
      ],
      totalPoints: 10,
      created_at: "2021-03-03T02:03:20.153Z",
      hasBeenEquated: true,
      league: "League of Extraordinary Bros",
      email: "lbhammett22@gmail.com",
      type: "sx",
      bigBikePoints: 10,
      smallBikePoints: null,
      smallBikePicks: [],
      rank: "2nd (Tied)",
    },
    {
      _id: "603eef1ea59cad00096896b6",
      user: "Kohl",
      week: 1,
      year: 2021,
      bigBikePicks: [
        {
          riderName: "Eli Tomac",
          position: 1,
          points: 0,
        },
        {
          riderName: "Ken Roczen",
          position: 2,
          points: 10,
        },
        {
          riderName: "Marvin Musquin",
          position: 3,
          points: 5,
        },
        {
          riderName: "Cooper Webb",
          position: 4,
          points: 0,
        },
        {
          riderName: "Justin Barcia",
          position: 5,
          points: 5,
        },
        {
          riderName: "Malcolm Stewart",
          position: 10,
          points: 0,
        },
        {
          riderName: "Justin Barcia",
          position: 100,
          points: 0,
        },
      ],
      totalPoints: 20,
      created_at: "2021-03-03T02:06:21.797Z",
      hasBeenEquated: true,
      league: "League of Extraordinary Bros",
      email: "kohl92@gmail.com",
      type: "sx",
      bigBikePoints: 20,
      smallBikePoints: null,
      smallBikePicks: [],
      rank: "1st",
    },
    {
      _id: "604ae8901dfce30008f3e357",
      user: "Kyler",
      week: 2,
      year: 2021,
      bigBikePicks: [
        {
          riderName: "Ken Roczen",
          position: 1,
          points: 5,
        },
        {
          riderName: "Zach Osborne",
          position: 2,
          points: 0,
        },
        {
          riderName: "Justin Barcia",
          position: 3,
          points: 0,
        },
        {
          riderName: "Adam Cianciarulo",
          position: 4,
          points: 0,
        },
        {
          riderName: "Chase Sexton",
          position: 5,
          points: 0,
        },
        {
          riderName: "Vince Friese",
          position: 10,
          points: 0,
        },
        {
          riderName: "Zach Osborne",
          position: 100,
          points: 0,
        },
      ],
      totalPoints: 5,
      hasBeenEquated: true,
      league: "League of Extraordinary Bros",
      created_at: "2021-03-12T04:05:36.166Z",
      email: "kyler.hopper@gmail.com",
      type: "sx",
      bigBikePoints: 5,
      smallBikePoints: null,
      smallBikePicks: [],
      rank: "3rd (Tied)",
    },
    {
      _id: "604ae8c81dfce30008f3e358",
      user: "Levi",
      week: 2,
      year: 2021,
      bigBikePicks: [
        {
          riderName: "Ken Roczen",
          position: 1,
          points: 5,
        },
        {
          riderName: "Justin Barcia",
          position: 2,
          points: 0,
        },
        {
          riderName: "Zach Osborne",
          position: 3,
          points: 0,
        },
        {
          riderName: "Eli Tomac",
          position: 4,
          points: 5,
        },
        {
          riderName: "Adam Cianciarulo",
          position: 5,
          points: 0,
        },
        {
          riderName: "Dean Wilson",
          position: 10,
          points: 0,
        },
        {
          riderName: "Adam Cianciarulo",
          position: 100,
          points: 0,
        },
      ],
      totalPoints: 10,
      hasBeenEquated: true,
      league: "League of Extraordinary Bros",
      created_at: "2021-03-12T04:06:32.713Z",
      email: "lbhammett22@gmail.com",
      type: "sx",
      bigBikePoints: 10,
      smallBikePoints: null,
      smallBikePicks: [],
      rank: "1st (Tied)",
    },
    {
      _id: "604ae8fc1dfce30008f3e359",
      user: "Kohl",
      week: 2,
      year: 2021,
      bigBikePicks: [
        {
          riderName: "Chase Sexton",
          position: 1,
          points: 0,
        },
        {
          riderName: "Zach Osborne",
          position: 2,
          points: 0,
        },
        {
          riderName: "Justin Barcia",
          position: 3,
          points: 0,
        },
        {
          riderName: "Eli Tomac",
          position: 4,
          points: 5,
        },
        {
          riderName: "Adam Cianciarulo",
          position: 5,
          points: 0,
        },
        {
          riderName: "Aaron Plessinger",
          position: 10,
          points: 0,
        },
        {
          riderName: "Eli Tomac",
          position: 100,
          points: 0,
        },
      ],
      totalPoints: 5,
      hasBeenEquated: true,
      league: "League of Extraordinary Bros",
      created_at: "2021-03-12T04:07:24.342Z",
      email: "kohl92@gmail.com",
      type: "sx",
      bigBikePoints: 5,
      smallBikePoints: null,
      smallBikePicks: [],
      rank: "3rd (Tied)",
    },
    {
      _id: "61d3a4e233bfab03d9edf02b",
      email: "brent.eckert7@gmail.com",
      week: 1,
      year: 2022,
      bigBikePicks: [
        {
          riderName: "Kyle Chisholm",
          position: 1,
          points: 0,
        },
        {
          riderName: "Dylan Ferrandis",
          position: 2,
          points: 0,
        },
        {
          riderName: "Dean Wilson",
          position: 3,
          points: 0,
        },
        {
          riderName: "Adam Cianciarulo",
          position: 4,
          points: 0,
        },
        {
          riderName: "Cooper Webb",
          position: 5,
          points: 0,
        },
        {
          riderName: "Chase Sexton",
          position: 10,
          points: 0,
        },
        {
          riderName: "Justin Brayton",
          position: 100,
          points: 0,
        },
      ],
      smallBikePicks: [
        {
          riderName: "Jett Lawrence",
          position: 1,
          points: 0,
        },
        {
          riderName: "Christian Craig",
          position: 2,
          points: 0,
        },
        {
          riderName: "Jalek Swoll",
          position: 3,
          points: 0,
        },
        {
          riderName: "Garrett Marchbanks",
          position: 4,
          points: 0,
        },
        {
          riderName: "Carson Mumford",
          position: 5,
          points: 0,
        },
        {
          riderName: "Seth Hammaker",
          position: 10,
          points: 0,
        },
        {
          riderName: "Colt Nichols",
          position: 100,
          points: 0,
        },
      ],
      totalPoints: 0,
      hasBeenEquated: false,
      league: "League of Extraordinary Bros",
      type: "sx",
      rank: null,
      deadline: "1/8/2022, 8:00:00 PM",
      created_at: "1/3/2022, 8:13:37 PM",
    },
  ],
];

describe("get-user", () => {
  test.todo("decipher returns as expected");
  test("compileLeaguePicks returns as expected", () => {
    const result = compileLeaguePicks({}, mockPicks);
    expect(result).toBeDefined();
    expect(Object.keys(result["League of Extraordinary Bros"])).toEqual(expect.arrayContaining(['2021', '2022']))
  });
});