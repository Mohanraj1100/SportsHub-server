const express = require('express')
const app = express();
const pool = require('./db');
const cors = require('cors');
const registerLogin=require('./routes/registerLogin');
const Dashboard = require('./routes/Dashboard');
const storeAuction = require('./routes/storeAuction')
const storeTeam = require('./routes/storeTeam')
const storePlayer = require('./routes/storePlayer')
const findAuctions = require('./routes/findAuctions')
const home=require('./routes/Home')
const OpenPanal = require('./routes/OpenPanal');
const AuctionPanel = require('./routes/AuctionPanel')
app.use(cors());
app.use(express.json()) 
app.use("/uploads",express.static("./uploads"))

app.use(registerLogin);
app.use(Dashboard);
app.use(storeAuction);
app.use(storeTeam);
app.use(storePlayer);
app.use(home);
app.use(OpenPanal);
app.use(findAuctions)
app.use(AuctionPanel)

app.use((req,res,next)=>{
    res.status(404).send("Page not found");
})

app.listen(5000,()=>{
    console.log("Server running on port 5000");
})