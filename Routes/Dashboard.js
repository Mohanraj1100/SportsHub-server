const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/organizer-dashboard', async (req, res) => {
  try {
    const { username } = req.query;
    const idResult = await pool.query('select id from users where username = $1', [username]);

    if (idResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const id = idResult.rows[0].id;
    const dashboardDetails = await pool.query(
        `select auctionName, TO_CHAR(auctionDate, 'DD Mon YYYY') AS auctiondate from createauctions WHERE profileId = $1`,
        [id]
      );
    
    res.json(dashboardDetails.rows);
  } catch (error) {
    console.error('Error fetching dashboard details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/myAuctions', async (req, res) => {
  try {
    const { username } = req.query;
    const user = await pool.query('select id from users where username = $1', [username]);
    // console.log(user.rows);

    const id = user.rows[0].id;
    const result = await pool.query(`
      SELECT id, auctionname, TO_CHAR(auctiondate, 'DD Mon YYYY') AS formattedAuctionDate,
      pointsperteam, minbid, bidincrease, playerperteam, profileid
      FROM createauctions
      WHERE profileid=$1
    `, [id]);

    // console.log(result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
