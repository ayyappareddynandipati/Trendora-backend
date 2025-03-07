const UserSchema = require("../models/UserSchema");
const express = require("express");
const Users=async(req,res)=>{
    const data=req.body;
    try{
        const user=await UserSchema(data);
        await user.save();
        res.status(201).json({message:"User Entered Successfully",data:user});
    }
    catch(err){
        res.status(400).json({message:err.message});
    }

}

module.exports=Users;