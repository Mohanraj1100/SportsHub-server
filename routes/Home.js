const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/todayAuctions', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, auctionname, TO_CHAR(auctiondate, 'DD-MM-YYYY') AS auctiondate,file_name
            FROM createauctions
        `);

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
