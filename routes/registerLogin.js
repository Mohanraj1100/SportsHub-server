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
        const {name,email,phoneNumber,message} = req.body;
        await pool.query("insert into contactus(username,email,phonenumber,message) values($1,$2,$3,$4)",[name,email,phoneNumber,message])
        // console.log(res.row[0]);
        return res.status(200).send({ message: "Sucess" });
    } catch (error) {
        console.log(error.message)
    }
})

router.put('/updatepass',async(req,res)=>{

    const {newpassword,username} = req.body;
    try{
        console.log("Inside update pass");
    const updatedQuery = await pool.query('UPDATE users set password = $1 WHERE username = $2',[newpassword,username])
    console.log("updated Sucessfully");
    return res.status(200).json({ message: "updated Sucessfully" });
    }
    catch(error)
    {
        console.log(error.message);
    }
})
  
router.get('/usercheck/:username',async(req,res)=>{
    const username = req.params.username;
    console.log("Forgot Pass",username);

    const checkQuery = await pool.query('select id from users where username = $1',[username])
    console.log(checkQuery.rows);
    if(checkQuery.rows.length > 0)
    {
        return res.status(200).json({ "message": "Got the user"})
    }
    return res.status(403).send({"code": "ERROR", "message": "Invalid Credentials"})
})

module.exports = router;