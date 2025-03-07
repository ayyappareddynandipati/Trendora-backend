const {  mongoose } = require("mongoose");

const express = require("express");
const VedaSchema=mongoose.Schema({
    userTeamCode:{
        type:String,
        required:true
    },
    userRollNumber:{
         type:String,
         required:true
    },
    userName:{
        type:String,
        required:true
    },
    userMobile:{
      type:Number,
        required:true
    },
    userCollege:{
        type:String,
        required:true
    },
    userEmail:{
        type:String,
        required:true
    },
    userGender:{
        type:String,
        required:true
    },
    userDepartment:{
        type:String,
        required:true
    },
    userLocation:{
        type:String,
        required:true
    },
    userYear:{
        type:Number,
        required:true
    },
    userEventCategory:{
        type:String,
        required:true
    },
    userEvent:{
        type:String,
        required:true
    },
    userTeamsize:{
        type:Number,
        required:true
    },
    userAccomodation:{
        type:String,
        required:true
    },
    otherCollege:{
        type:String,
        required:false
    }
     
    
})
module.exports=mongoose.model('Veda',VedaSchema);