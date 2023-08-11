const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/findAuctions/search', async (req, res) => {
  const searchInput = req.query.name; 
  console.log(searchInput)
  try {
   const result = await pool.query(
    "SELECT id, auctionname, TO_CHAR(auctiondate, 'DD-MM-YYYY') AS formatedauctiondate,auctiondate,file_name FROM createauctions WHERE auctionname ILIKE $1", 
    [`%${searchInput}%`]
   );
   console.log(result.rows)
   res.json(result.rows);
  } catch (error) {
   console.error('Error executing query:', error);
   res.status(500).json({ error: 'An error occurred while searching for auctions' });
  }
 });

module.exports = router;