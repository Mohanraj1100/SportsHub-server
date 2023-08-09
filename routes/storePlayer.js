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
            callback(null, `player-image-${Date.now()}.${file.originalname}`)
        }
    }
)

const upload = multer({
    storage: imgconfig
})

router.post('/playerregister', upload.single("photo"), async (req, res) => {
    const { teamname, teamshortname, shortcutkey, auctionid } = req.body;
    const { filename } = req.file;
    // console.log(req);

    try {
          const idRes = await pool.query("SELECT auctionname FROM createauctions WHERE id = $1", [auctionid]);
        //   console.log(idRes);
          const auctionname = idRes.rows[0].auctionname; 
        await pool.query("INSERT INTO team_details(teamname, teamshortname, teamshortcutkey, auctionname,teamfilename) VALUES ($1, $2, $3, $4, $5)", [ teamname, teamshortname, shortcutkey,auctionname,filename]);
        console.log("Data added");
        res.status(201).json({ message: "File uploaded successfully!" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Error uploading data" });
    }
});


router.get('/players', async (req, res) => {
    try {
        const { id } = req.query;
        // console.log(id);
        const auctionname = await pool.query('select auctionname from createauctions where id = $1', [id]);
        const auctionoriginal = auctionname.rows[0].auctionname;
        console.log(auctionoriginal);
        // if (auctionname.rows.length == 0) {
        //     return res.status(403).json({ error: 'no auction found' });
        // }

        const teamDetails = await pool.query('select team_id,teamname,teamshortname,teamshortcutkey from team_details where auctionname = $1',[auctionoriginal])
        console.log(teamDetails);
        res.json(teamDetails.rows)
    }
    catch (error) {
        console.log(error.message);
    }

})

router.put('/updateplayer',async(req,res)=>{

    const {teamname,teamshortname,shortcutkey,teamid} = req.body;
    try{
    const updatedQuery = await pool.query('UPDATE team_details set teamname = $1, teamshortname = $2, teamshortcutkey = $3 WHERE team_id = $4',[teamname,teamshortname,shortcutkey,teamid])
    console.log("updated Sucessfully");
    return res.status(200).json({ message: "updated Sucessfully" });

    }
    catch(error)
    {
        console.log(error.message);
    }
})

router.delete('/deleteplayer', async (req, res) =>{
    const teamid = req.params.teamid;
    try {
        const deleteData = await pool.query('Delete from team_details where team_id = $1',[teamid])
        return res.status(200).json({ message: "Deleted successfully!" });
        
    } catch (error) {
        console.log(error.message);
    }

    
  })
module.exports = router


