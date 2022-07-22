const express = require("express");
const router = express.Router();
const { createToken, verifyToken } = require("../config/auth.js");

// Home
router.get('/home', verifyToken, async (req, res, next) => {
  // TODO
  // this can probably go with user doc in settings.stats
  // achievements, badges, titles, progress, etc.
  // get user's record (wins vs. losses, hits)
  // get user's upcoming matches (venue, location, position, time)
  res.json({
    achievements: {}, // flawless victory, 100 points, etc.
    badges: {}, // armorer, A rank, 10 matches, etc.
    titles: {}, // armorer, monitor, etc.
    rank: "U", // rank U (Unranked), E, D, C, B, A
    matches: 0,
    points: 0,
    wins: 0,
    losses: 0,
    win_streak: 0,
    lose_streak: 0, // maybe not this
  });
});

module.exports = router;
