const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/openPanal', async (req, res) => {
    try {
      const { id } = req.query;
      const result1 = await pool.query(`SELECT id, auctionname FROM createauctions WHERE id=$1`, [id]);
      const auctionId = result1.rows[0].id;
      // console.log(result1.rows[0]);

      res.json(result1.rows);

      // const result2 = await pool.query(`SELECT player_id, playername, playerfilename FROM player_details WHERE auctionid=$1`, [auctionId]);
      // console.log(res.json(result2.rows));
  
      // const players = result2.rows;
      // if (!players) {
      //   return res.status(404).json({ error: 'Players not found' });
      // }
  
      // res.json(players);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

module.exports = router;
