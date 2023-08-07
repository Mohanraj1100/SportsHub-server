const express = require('express')
const app = express();
const pool = require('./db');
const cors = require('cors');
const registerLogin=require('./Routes/registerLogin');
app.use(cors());
app.use(express.json()) 


app.use(registerLogin);

app.use((req,res,next)=>{
    res.status(404).send("Page not found");
})

app.listen(5000,()=>{
    console.log("Server running on port 5000");
})