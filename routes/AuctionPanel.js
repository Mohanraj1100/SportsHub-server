const express = require('express');
const pool = require('../db');
const router = express.Router();


router.get('/allplayers/:auctionid', async (req, res)=>{
    const auctionid = req.params.auctionid;

    const getData = await pool.query('Select * from player_details where auctionid = $1',[auctionid])
    // console.log(getData);
    res.json(getData.rows)
})

router.get('/availableplayers/:auctionid', async (req, res)=>{
    const auctionid = req.params.auctionid;
    // console.log("Available players",auctionid);
    const getData = await pool.query('Select * from player_details where auctionid = $1 AND playerstatus is null',[auctionid])
    // console.log("Available players got sucessfully",getData.rows);
    res.json(getData.rows)
})


router.get('/soldplayers/:auctionid', async (req, res)=>{
    const auctionid = req.params.auctionid;
    const sold = 'SOLD'
    // console.log("Available players",auctionid);
    const getData = await pool.query('Select * from player_details where auctionid = $1 AND playerstatus = $2',[auctionid,sold])
    // console.log(getData);
    res.json(getData.rows)
})

router.get('/unsoldplayers/:auctionid', async (req, res)=>{
    const auctionid = req.params.auctionid;
    const sold = 'UNSOLD'
    // console.log("Available players",auctionid);
    const getData = await pool.query('Select * from player_details where auctionid = $1 AND playerstatus = $2',[auctionid,sold])
    // console.log(getData);
    res.json(getData.rows)
})

router.get('/auctionteamlist/:auctionid', async (req, res)=>{
    const auctionid = req.params.auctionid;
    const idRes = await pool.query("SELECT auctionname FROM createauctions WHERE id = $1", [auctionid]);
    const auctionname = idRes.rows[0].auctionname; 
    console.log("Team List players",auctionid);
    const getData = await pool.query('Select * from team_details where auctionname = $1',[auctionname])
    // console.log(getData);
    res.json(getData.rows)
})

router.get('/individualteamplayers/:auctionid/:teamid', async (req, res)=>{
    const auctionid = req.params.auctionid;
    const teamid = req.params.teamid
    // console.log("Available players",auctionid);
    const getData = await pool.query('Select * from player_details where auctionid = $1 AND teamid = $2',[auctionid,teamid])
    // console.log(getData);
    res.json(getData.rows)
})


module.exports = router;