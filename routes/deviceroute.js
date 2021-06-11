const express= require('express')
const deviceModel= require('../models/device')
const router= express.Router()
router.use(express.json())
router.post('/new',async(req,res)=>{
    const newDevice= new deviceModel({
        macId: req.body.macId,
    })  
    try{
        const newDevieUplaod= await newDevice.save()
        res.json({status: true, data: newDevieUplaod})
    }
    catch(err)
    {   
        res.json({status: false, error: "Database error", code: 201})
    }
})

router.get('/mac/:macId',async(req,res)=>{
    if(req.params.macId===null)
    {
        req.params.macId=''
    }
    try{
        const deviceData= await deviceModel.find({'macId': req.params.macId})
        if(deviceData.length!==0)
            res.json({status: true, data: deviceData})
        else
            res.json({status: false, error: "No data", code: 202})
    }
    catch(err)
    {
        res.json({status: false, error: "Database error", code: 201})
    }
})

router.patch('/register/:macId',async(req,res)=>{
    try{
        const updateQuery=await deviceModel.updateOne({'macId': req.params.macId, 'isRegistered': false},{'$set':{'isRegistered': true, 'registeredTo': req.body.registeredTo}})
        if(updateQuery.nModified===0)
        {
            res.json({status: false, error : 'No such macId or already registered', code : 300})
        }
        res.json({status: true, data: updateQuery})
    }
    catch(err){
        res.json({status: false, error : 'Daatabase Error', code : 201})

    }   
})
router.get('/check/:macId', async(req,res)=>{
    try{
        const getQuery=await deviceModel.findOne({'macId': req.params.macId})
        if(getQuery!=null && !getQuery.isRegistered)
        {
            res.json({status : true})
        }
        else if(getQuery!=null && getQuery.isRegistered)
        {
            res.json({status : false, error: 'Device already registered', code: 310})
        }
        else
        {
            res.json({status : false, error: 'Device not found', code: 311})
        }
    }
    catch(err)
    {
        res.json({status: false, error : 'Daatabase Error', code : 201})
    }
})
router.get('/getdevices/:userid',async (req,res)=>{
    try{
        const findDevices= await deviceModel.find({'registeredTo': req.params.userid})
        res.json({status: true, data: findDevices})
    }
    catch(err){
        res.json({status: false, error: 'Database Error', code: 201, additional: err.message })
    }

})
router.get('/deregister/:macid',async(req,res)=>{
    try{
        const updateQuery=await deviceModel.updateOne({'macId': req.params.macid},{'$set':{'isRegistered': false, 'registeredTo': null}})
        if(updateQuery.nModified===0)
        {
            res.json({status: false, error : 'No such macId or already registered', code : 300})
        }
        res.json({status: true, data: updateQuery})
    }
    catch(err){
        res.json({status: false, error : 'Daatabase Error', code : 201})

    }   
    
})
module.exports=router