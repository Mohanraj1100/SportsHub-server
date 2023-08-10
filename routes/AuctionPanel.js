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
    console.log("Available players",auctionid);
    const getData = await pool.query('Select * from player_details where auctionid = $1 AND playerstatus is null',[auctionid])
    // console.log(getData);
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




module.exports = router;