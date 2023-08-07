const Pool = require('pg').Pool;

    const pool = new Pool({
    user:"postgres",
    password:"sportshubauctionhere",
    host:"db.helpdufvadtgkahjnzpp.supabase.co",
    port:"5432",
    database:"postgres"
});



module.exports = pool;