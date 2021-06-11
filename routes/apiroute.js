const express=require('express')
const router= express.Router()
const userRoute= require('./userapiroute')
const deviceRoute= require('./deviceroute')
const alertRoute=require('./alertroute')

router.use('/user',userRoute)
router.use('/device',deviceRoute)
router.use('/alert',alertRoute)


module.exports=router