const mongoose=require('mongoose')
const validator=require('validator')
const emergencyContact = mongoose.Schema({
    name:{
        type : String,
        required: true
    },
    email:{
        type: String,
        required:true,
        validate:{
                validator : (value) =>{
                    return validator.isEmail(value)
                },
                message : "Provide a valid email"
            }
    },
    phone:{
        type: String,
        required:true,
        validate:{
                validator : (value) =>{
                    return validator.isMobilePhone(value)
                },
                message : "Provide a valid phone"
            }
    }
})
const user=mongoose.Schema({
    name :{
        type : String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required:true,
        validate:{
                validator : (value) =>{
                    return validator.isEmail(value)
                },
                message : "Provide a valid email"
            }
    },
    password:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    blood:{
        type : String,
        required : true
    },
    emergencyContacts:{
        type : [emergencyContact],
        required: true,
    },
    contactNumber:{
        type: String,
        required:true,
        validate:{
                validator : (value) =>{
                    return validator.isMobilePhone(value)
                },
                message : "Provide a valid phone"
            }
    },
})
user.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
   }
module.exports=mongoose.model('User',user)