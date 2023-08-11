const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/todayAuctions', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, auctionname, TO_CHAR(auctiondate, 'DD-MM-YYYY') AS auctiondate,file_name
            FROM createauctions WHERE auctiondate = CURRENT_DATE
        `);

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/upcomingAuctions', async (req, res) => {
    try {
        const result = await pool.query(`
        SELECT 
        id, 
        auctionname, 
        TO_CHAR(auctiondate, 'DD-MM-YYYY') AS formatedauctiondate,
        auctiondate,
        file_name 
    FROM 
        createauctions 
    WHERE 
        auctiondate > CURRENT_DATE`);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/clients',async(req,res)=>{
    try{
    const result=await pool.query('select * from clients');
    res.json(result.rows)
    }catch(error){
        console.error(error.message);
        res.status(500).json({error:'Internal server error'})
    }
})
module.exports = router;
