const express= require('express')
const nodemailer= require('nodemailer')
const userModel=require('../models/user')
const deviceModel=require('../models/device')
const alertModel=require('../models/alert')
const router=express.Router()
require('dotenv/config')
const transport= nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth:{
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
})
const sendmailAccident= async (to, details,time)=>{
    const mail = await transport.sendMail({
        from: process.env.EMAIL,
        to: to,
        subject: '❗❗ACCIDENT ALERT❗❗',
        html: `<html>
                <body>
                    <h1>Accident Alert System</h1>
                    <h2>There has been an accident of <span style="color:red">${details.name} [${details.email}]</span>.</h2><br>
                    <h3>Your contact details was given as emegency contact by ${details.name}</h3>
                    <div style="font-size:18px; color:red; "> 
                        Name : ${details.name}<br>
                        Phone : ${details.contactNumber}<br>
                        Blood : ${details.blood}<br>
                        Gender : ${details.gender}<br> 
                        Location of accident : Somewhere <br>
                        Time of Accident : ${time}<br><br>
                    </div>
                 <div style="font-size:20px;">
                    Please kindly respond to the call. Call an amubulance.
                    </div>
                </body>
                </html>`
    })
    return mail
}
const sendMailAlcohol = async (to, details, time)=>{
    const mail = await transport.sendMail({
        from: process.env.EMAIL,
        to: to,
        subject: '❗❗ALCOHOL ALERT❗❗',
        html: `<html>
                <body>
                    <h1>Alcohol Alert System</h1>
                    <h2><span style="color:red">${details.name} [${details.email}]</span> has been consuming alcohol.</h2><br>
                    <div style="font-size:18px; color:red; "> 
                    ⚠⚠ Caution ⚠⚠ <br>
                    As per policy, the vehicle will not start while you are in effect of alcohol.
                    </div>
                <div style="font-size:20px;">
                    Alcohol was detected at ${time}<br>
                    If you think it is a mistake, please log into your account for overriding 
                </div>
                </body>
                </html>`
    })
    return mail
}
router.get('/accident/:macid',async(req,res)=>{
    var io= req.app.get('socketio')
    const accidentTime=new Date()
    try{
        var deviceDetails=await deviceModel.findOne({'macId': req.params.macid})
        if(deviceDetails===null)
            res.json({status: false, error : "Device not found!!!", code : 601})
    }
    catch(err){
        res.json({status: false, error : "Database Error", code : 602})
    }
    try{
        var userDetails=await userModel.findById(deviceDetails.registeredTo)
        if(userDetails===null)
        {
            res.json({status: false, error : "User not found!!!", code : 603})
        }
    }
    catch(err)
    {
        res.json({status: false, error : "Database Error", code : 602})
    }
    var emails
    userDetails.emergencyContacts.map((item)=>{
        emails=item.email+','
    })
    console.log(emails.slice(0,-1))
    
    const newAlert= new alertModel({
        userId: userDetails._id,
        alertType: 'accident',
        time : accidentTime,
        location : 'somewhere',
        macId: req.params.macid
    })
    try{
        const message=await sendmailAccident(emails.slice(0,-1),userDetails,accidentTime)
        const alertRegister= await newAlert.save();
        io.to(`${userDetails._id}`).emit('new-alert',alertRegister)
        res.json({status: true,alertRegister : alertRegister , mailResp: {accepted : message.accepted, rejected : message.rejected} })
    }
    catch(err)
    {
        res.json({status: false, error : "Database Error",additional: err.message, code : 602})
    }

})

router.get('/alcohol/:macid',async(req,res)=>{
    var io= req.app.get('socketio')
    const detectedTime= new Date()
    try{
        var deviceDetails=await deviceModel.findOne({'macId': req.params.macid})
        if(deviceDetails===null)
            res.json({status: false, error : "Device not found!!!", code : 601})
    }
    catch(err){
        res.json({status: false, error : "Database Error", code : 602})
    }
    try{
        var userDetails=await userModel.findById(deviceDetails.registeredTo)
        if(userDetails===null)
        {
            res.json({status: false, error : "User not found!!!", code : 603})
        }
    }
    catch(err)
    {
        res.json({status: false, error : "Database Error", code : 602})
    }
    const newAlert= new alertModel({
        userId: userDetails._id,
        alertType: 'alcohol',
        time : detectedTime,
        location : 'somewhere',
        macId: req.params.macid
    })
    try{
        const alertRegister= await newAlert.save();
        const message=await sendMailAlcohol(userDetails.email,userDetails,detectedTime)
        console.log(userDetails._id)
        io.to(`${userDetails._id}`).emit('new-alert',alertRegister)
        res.json({status: true,alertRegister : alertRegister , mailResp: {accepted : message.accepted, rejected : message.rejected} })
    }
    catch(err){
        res.json({status: false, error : "Database Error",additional: err.message, code : 602})
    }
})
router.get('/getalerts/:userid',async(req,res)=>{
    try{
        const getAlerts= await alertModel.find({"userId": req.params.userid})
        res.json({status: true, data: getAlerts})
    }
    catch(err){
        res.json({status: false, error : "Database Error",additional: err.message, code : 602})
    }
})
module.exports=router