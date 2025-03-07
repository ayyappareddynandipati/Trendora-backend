const express = require('express');
const UserController = require('../Controllers/UserController');
const upload = require('../config/multer');
const { File } = require('../models/UserSchema');

const Route=express.Router();
// Route.post('/users',UserController.createUser)
// Route.get('/users/getall', UserController.getalldata)
// Route.get('/users/getbyid/:id',UserController.getbyid)
// Route.put('/users/update/:id',UserController.updateuser)
// Route.post('/users/bulk',UserController.insertBulk)
// Route.post('/sendmail',UserController.sendmail)
// Route.post('/upload',upload.single('file'),async(req,res)=>{
//     try {
//         const file = new File({
//           filename: req.file.filename,
//           filepath: req.file.path,
//         });
//         await file.save();
//         res.json({ message: "File uploaded successfully", file });
//       } catch (error) {
//         res.status(500).json({ message: "Upload failed", error: error.message });
//       }
// })
// Route.get('/get-users-city',UserController.getusersbycity)
module.exports =Route;