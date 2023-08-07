const express = require('express')
const pool = require('../db')
const router=express.Router();

router.post('/register',async(req,res)=>{
    try{
        const {username,password,email,phoneNumber} = req.body;

        const userWithSameEmail = await pool.query("Select * from users where email=$1",[email]);
        console.log(userWithSameEmail);
        const userWithSameUsername = await pool.query("Select * from users where username=$1",[username]);
        if((userWithSameEmail.rows.length > 0)  || (userWithSameUsername.rows.length > 0)){
            return res.status(403).json({"code": "ERROR", "message": "Email or UserName  is already registered Check It Properly"})
        } 
        await pool.query("Insert into users(username,password,email,phonenumber) values($1,$2,$3,$4)",[username,password,email,phoneNumber])
        return res.status(200).send({ message: "Sucess" });
    }
    catch(error)
    {
        console.log(error.message);
    }
})

router.post('/login',async(req,res)=>{
    const {username,password} = req.body;

    const user = await pool.query("Select * from users where username=$1",[username]);
    const userPassWord = await pool.query("Select * from users where password=$1",[password]);

    if((user.rows.length > 0)  && (userPassWord.rows.length > 0)){
        return res.status(200).json({ "message": "Login Sucessfull"})
    }
    return res.status(403).send({"code": "ERROR", "message": "Invalid Credentials"})

})


router.post('/contactus',async(req,res)=>{
    try {
        const {userName,email,phoneNumber,message} = req.body;
        await pool.query("Insert into contactus(userName,email,phonenumber,message) values($1,$2,$3,$4)",[userName,email,phoneNumber,message])
        return res.status(200).send({ message: "Sucess" });
    } catch (error) {
        console.log(error.message)
    }
   

})

module.exports = router;