const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/openPanal', async (req, res) => {
    try {
      const { id } = req.query;
      const resultAuction = await pool.query(`SELECT id, auctionname FROM createauctions WHERE id=$1`, [id]);
      const auctionId = resultAuction.rows[0].id;
      // console.log(resultAuction.rows[0]);

      res.json(resultAuction.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/auction', async (req, res) => {
  try {
    const { id } = req.query;
    
    const resultAuction = await pool.query('SELECT id, auctionname, minbid, bidincrease, playerperteam FROM createauctions WHERE id = $1', [id]);
    
    if (resultAuction.rows.length === 0) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    const auctionData = resultAuction.rows[0];

    const resultPlayer = await pool.query('SELECT player_id, playername, playerfilename, teamid, playerstatus FROM player_details WHERE auctionid = $1', [auctionData.id]);

    const players = resultPlayer.rows;
    if (players.length === 0) {
      return res.status(404).json({ error: 'Players not found' });
    }

    const resultTeam = await pool.query('SELECT team_id, teamname, teamfilename FROM team_details WHERE auctionname = $1', [auctionData.auctionname]);

    const teams = resultTeam.rows;
    if (teams.length === 0) {
      return res.status(404).json({ error: 'Players not found' });
    }

    res.json({ auction: auctionData, players: players, teams: teams });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/updatesoldplayer',async(req,res)=>{

  const {playerid, teamid, playerstatus } = req.body;
  console.log(req.body);
  try{
  const updatedQuery = await pool.query('UPDATE player_details set teamid = $1, playerstatus = $2 WHERE player_id = $3',[teamid,playerstatus,playerid])
  console.log("updated Sucessfully");
  return res.status(200).json({ message: "updated Sucessfully" });
  }
  catch(error)
  {
      console.log(error.message);
  }
})



module.exports = router;
