const express = require('express')
const multer = require("multer");
const pool = require('../db');
const router = express.Router();

//img store config
const imgconfig = multer.diskStorage(
    {
        destination:(req,file,callback)=>{
            callback(null,"./uploads")
        },
        filename:(req,file,callback)=>{
            callback(null,`image-${Date.now()}.${file.originalname}`)
        }
    }
)

const upload = multer({
    storage:imgconfig
})

router.post('/auctionregister', upload.single("photo"), async (req, res) => {
    const { type, auctionname, auctiondate, pointsperteam, minimumbid, bidincreaseby, playerperteam, username } = req.body;
    const { filename } = req.file;
  
    try {
      const idRes = await pool.query("SELECT id FROM users WHERE username = $1", [username]);
      const id = idRes.rows[0].id; 
  
      await pool.query("INSERT INTO createauctions(auctiontype, auctionname, auctiondate, pointsperteam, minbid, bidincrease, playerperteam, profileid,file_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9)", [type, auctionname, auctiondate, pointsperteam, minimumbid, bidincreaseby, playerperteam, id,filename]);
  
      console.log("Data added");
      res.status(201).json({ message: "File uploaded successfully!" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Error uploading data" });
    }
  });

  

  router.put('/updateauction',async(req,res)=>{

    const {type,auctionname,auctiondate,pointsperteam,minimumbid,bidincreaseby,playerperteam,auctionid} = req.body;
    console.log(auctionid);
    try{
    const updatedQuery = await pool.query('UPDATE createauctions set auctiontype = $1, auctionname = $2, auctiondate = $3,pointsperteam=$4,minbid=$5,bidincrease=$6,playerperteam=$7 WHERE id = $8',[type,auctionname,auctiondate,pointsperteam,minimumbid,bidincreaseby,playerperteam,auctionid])
    console.log("updated Sucessfully");
    return res.status(200).json({ message: "updated Sucessfully" });

    }
    catch(error)
    {
        console.log(error.message);
    }
})

  module.exports = router


