const express=require('express')
const bcrypt=require('bcrypt')
const nodemailer=require('nodemailer')
const userModel= require('../models/user')
const deviceModel= require('../models/device')
const user = require('../models/user')
const router= express.Router()
require('dotenv/config')
router.use(express.json())

const transport= nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth:{
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
})


router.post('/signup', async (req,res)=>{
    try{
        var hashedPassword= await bcrypt.hash(req.body.password,10)
    }
    catch(err){
        res.json({status : false , error: "Paasword not processed", code : 10})
    }
    const newUser= new userModel({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        gender: req.body.gender,
        blood: req.body.blood,
        emergencyContacts: req.body.emergencyContacts,
        contactNumber: req.body.contactNumber
    })
    
    try{
        const userupload= await newUser.save()
        res.json({status: true , data: userupload})
    }
    catch(err)
    {
        res.json({status : false , error: "Database Error", additonal: err.message, code : 11})
    }
})

router.post('/login', async(req, res)=>{
    if(req.body.email===undefined || req.body.password===undefined) 
    {
        res.json({status: false, error : 'email or password not recieved'})
    }
    try{
        const userDetails= await userModel.findOne({'email': req.body.email})
        if(userDetails===null)
        {
            res.json({status: false, error : 'Account not found', code : 101})
        }
        const passCheck= await bcrypt.compare(req.body.password, userDetails.password)
        if(passCheck===true)
        {
            req.session.islogged=true
            req.session.userDetails=userDetails
            console.log(req.session)
            res.json({status: true})
        }
        else
        {
            res.json({status: false, error: "Password not a match", code : 102})
        }
    }
    catch(err){
        res.json({status : false, error: err, code: 100 })
    }
})

router.get('/logout',(req,res)=>{
    delete req.session.userDetails
    req.session.islogged=false
    console.log(req.session)
    res.json({status: true, message: 'logged off'});
})

router.post('/add/mail', async (req,res)=>{
    if(req.body.email===undefined)
    {
        res.json({status: false, error : 'email not provided', code : 103})
    }
    var userDetails={}
    try{
        userDetails= await userModel.findOne({'email': req.body.email})
        if(userDetails===null)
        {
            res.json({status : false , error: "User not found", code : 104})
        }
    }
    catch(err)
    {   
        res.json({status : false , error: "Database Error", code : 311})
    }   
    try{
        var queryResponse=[]
        req.body.deviceIds.map(async(item)=>{
            const updateQuery = await deviceModel.updateOne({'macId': item},{ isRegistered : true, registeredTo: userDetails._id})
            if(updateQuery.nModified===0)
            {   
                queryResponse.push({status: false, macId: item, error : 'No such macId or already registered', code : 300})
            }
            else
            {
                queryResponse.push({status:true, macId: item , data: updateQuery})
            }
        })
        res.json({status : true, response : queryResponse})
    }
    catch(err){
        res.json({status : false , error: "Database Error", code : 311})
    }   
})
module.exports=router