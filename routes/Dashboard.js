const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/organizer-dashboard', async (req, res) => {
  try {
    const { username } = req.query;
    const idResult = await pool.query('select id from users where username = $1', [username]);

    if (idResult.rows.length === 0) {
      return res.status(403).json({ error: 'User not found' });
    }

    const id = idResult.rows[0].id;
    const dashboardDetails = await pool.query(
        `select id,auctionName, TO_CHAR(auctionDate, 'DD Mon YYYY') AS auctiondate, file_name from createauctions WHERE profileId = $1`,
        [id]
      );
    
    res.json(dashboardDetails.rows);
  } catch (error) {
    console.log(error.message);
  }
});


router.get('/myAuctions', async (req, res) => {
  try {
    const { username } = req.query;
    const user = await pool.query('select id from users where username = $1', [username]);

    const id = user.rows[0].id;
    const result = await pool.query(`
      SELECT id, auctionname, TO_CHAR(auctiondate, 'DD Mon YYYY') AS auctiondate,
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

router.get('/auctionDetails', async (req, res) => {
  try {
    const { id } = req.query;
    const result = await pool.query(
      `SELECT id, auctionname, TO_CHAR(auctiondate, 'YYYY-MM-DD') AS auctiondate, pointsperteam, minbid, bidincrease, playerperteam, profileid FROM createauctions WHERE id=$1`,
      [id]
    );

    const auction = result.rows[0];
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    res.json(auction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/transferPlayer', async  (req, res) => {
  try{
  const { sourceAuctionId, targetAuctionId } = req.body;
  console.log(sourceAuctionId)
  console.log(targetAuctionId)
  const playersResponse = await pool.query('select * from player_details where auctionid = $1',[targetAuctionId])
  const players = playersResponse.rows;
  console.log(players);
  if(players.length>0){
  for (const player of players) {
    await pool.query('UPDATE player_details SET auctionid = $1 WHERE player_id = $2', [sourceAuctionId, player.player_id]);

  }
  res.status(200).json({ message: 'Player Transferred Successfully' });
  }
  else{
    res.status(404).json({ message: 'No Player Available' });
  }
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
}
});

router.post('/transferTeam', async  (req, res) => {
  try{
  const { sourceAuctionName, targetAuctionName } = req.body;
  console.log(sourceAuctionName)
  console.log(targetAuctionName)
  const teamsResponse = await pool.query('select * from team_details where auctionname = $1',[targetAuctionName])
  const teams = teamsResponse.rows;
  console.log(teams);
  if(teams.length>0){
    console.log(teams.length)
  for (const team of teams) {
    await pool.query('UPDATE team_details SET auctionname = $1 WHERE team_id = $2', [sourceAuctionName, team.team_id]);

  }
  res.status(200).json({ message: 'Teams Transferred Successfully' });
}
else{
  res.status(404).json({ message: 'No Team Available' });
}
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
}
});
module.exports = router;
