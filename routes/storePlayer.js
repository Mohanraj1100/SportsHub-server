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
    const {playername,mobilenumber,playerfathername,age,batting,bowling,wicketkeeper,tshirt,trouser,address,auctionid} = req.body;
    const { filename } = req.file;
    console.log(req.body);

    try {
        //   const idRes = await pool.query("SELECT auctionname FROM createauctions WHERE id = $1", [auctionid]);
        //   console.log(idRes);
        //   const auctionname = idRes.rows[0].auctionname; 
        await pool.query("INSERT INTO player_details(playerfilename, playername, mobilenumber, fathername,playerage,batting,bowling,wicketkeeper,tshirtsize,trousersize,address,auctionid) VALUES ($1, $2, $3, $4, $5,$6,$7,$8,$9,$10,$11,$12)", [ filename,playername,mobilenumber,playerfathername,age,batting,bowling,wicketkeeper,tshirt,trouser,address,auctionid]);
        console.log("Data added");
        res.status(201).json({ message: "File uploaded successfully!" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Error uploading data" });
    }
});

router.get('/playersinfo/:id', async (req, res) => {
    try {
        const { id } = req.params;

        console.log(id);
        const playersname = await pool.query('select * from player_details where player_id = $1', [id]);
        // const auctionoriginal = auctionname.rows[0].auctionname;
        // console.log(auctionoriginal);
        // // if (auctionname.rows.length == 0) {
        // //     return res.status(403).json({ error: 'no auction found' });
        // // }

        // const teamDetails = await pool.query('select team_id,teamname,teamshortname,teamshortcutkey from team_details where auctionname = $1',[auctionoriginal])
        // console.log(teamDetails);
        // console.log(playersname);
        res.json(playersname.rows[0])
    }
    catch (error) {
        console.log(error.message);
    }

})


router.get('/players/:id', async (req, res) => {
    try {
        const { id } = req.params;

        console.log(id);
        const playersname = await pool.query('select * from player_details where auctionid = $1 order by player_id', [id]);
    
        res.json(playersname.rows)
    }
    catch (error) {
        console.log(error.message);
    }

})

router.put('/updateplayer/:id',async(req,res)=>{
    const { id } = req.params;
    console.log(id);
    const {playername,mobilenumber,fathername,playerage,batting,bowling,wicketkeeper,tshirt,trouser,address} = req.body;
    console.log("FatherName",fathername);
    try{
    const updatedQuery = await pool.query('UPDATE player_details set playername = $1, mobilenumber = $2, fathername = $3,playerage = $4,batting = $5,bowling = $6,wicketkeeper = $7,tshirtsize = $8,trousersize = $9,address = $10 WHERE player_id = $11',[playername,mobilenumber,fathername,playerage,batting,bowling,wicketkeeper,tshirt,trouser,address,id])
    console.log("updated Sucessfully");
    return res.status(200).json({ message: "updated Sucessfully" });

    }
    catch(error)
    {
        console.log(error.message);
    }
})

router.delete('/deleteplayer/:playerid', async (req, res) =>{
    const playerid = req.params.playerid;
    console.log(playerid);
    try {
        const deleteData = await pool.query('Delete from player_details where player_id = $1',[playerid])
        return res.status(200).json({ message: "Deleted successfully!" });
        
    } catch (error) {
        console.log(error.message);
    }

    
  })
module.exports = router


