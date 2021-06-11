const mongoose=require('mongoose')
const device = mongoose.Schema({
    macId:{
        type: String,
        required : true,
        unique: true,
    },
    dom:{
        type: Date,
        required: true,
        default: new Date()
    },
    isRegistered:{
        type : Boolean,
        required: true,
        default: false
    },
    registeredTo:{
        type : String,
    }
})

module.exports=mongoose.model('Device',device)