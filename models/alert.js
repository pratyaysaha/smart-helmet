const mongoose=require('mongoose')
const alert = mongoose.Schema({
    userId :{
        type: String,
        required: true,
    },
    macId: {
        type : String,
        required: true,
    },
    time : {
        type : Date,
        required: true,
    },
    location:{
        type: String,
    },
    alertType:{
        type: String,
        required: true
    }
})
module.exports=mongoose.model('Alert',alert)
