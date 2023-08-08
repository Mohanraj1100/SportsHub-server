const express = require('express')
const multer = require("multer");
const pool = require('../db');
const router = express.Router();

//img store config
const imgconfig = multer.diskStorage(
    {
        destination: (req, file, callback) => {
            callback(null, "./uploads")
        },
        filename: (req, file, callback) => {
            callback(null, `team-image-${Date.now()}.${file.originalname}`)
        }
    }
)

const upload = multer({
    storage: imgconfig
})

router.post('/teamregister', upload.single("photo"), async (req, res) => {
    const { teamname, teamshortname, shortcutkey, auctionid } = req.body;
    const { filename } = req.file;
    console.log(req);

    try {
          const idRes = await pool.query("SELECT auctionname FROM createauctions WHERE id = $1", [auctionid]);
          console.log(idRes);
        //   const id = idRes.rows[0]; 

        // await pool.query("INSERT INTO team_details(teamname, teamshortname, shortcutkey, auctionname,file_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9)", [type, auctionname, auctiondate, pointsperteam, minimumbid, bidincreaseby, playerperteam, id, filename]);
        console.log("Data added");
        // res.status(201).json({ message: "File uploaded successfully!" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Error uploading data" });
    }
});


router.get('/teams', async (req, res) => {
    try {
        const { id } = req.query;
        const auctionname = await pool.query('select auctionname from createauctions where id = $1', [id]);
        if (auctionname.rows.length == 0) {
            return res.status(403).json({ error: 'no auction found' });
        }

        const teamDetails = await pool.query('select team_id,teamname,teamshortname,teamshortcutkey from team_details where auctionname = $1,'[auctionname])
        res.json(teamDetails.rows)
    }
    catch (error) {
        console.log(error.message);
    }

})
module.exports = router


