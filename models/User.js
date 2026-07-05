const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    first_name:{
        type:String,
        required:true,
        trim:true
    },
    
    last_name:{
        type:String,
        required:true,
        trim:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },

    phone:{
        type:String,
        required:false
    },

    gender: { 
        type: String, 
        enum: ['male', 'female', 'other', ''], 
        default: "" ,
        required:false
    },

    password:{
        type:String,
        required:true
    },

    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    }
},
{
    timestamps:true
});

module.exports = mongoose.model("User",userSchema);