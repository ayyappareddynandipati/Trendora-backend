const express = require('express');
const Route = express.Router();
const EventController = require('../Controllers/EventController');
// const Userregistration = require('../Controllers/Userregistration');
const UsersController = require('../Controllers/UsersController');

Route.post('/newuser', EventController.createUser);
Route.put('/update', EventController.updateUserName);
Route.delete('/delete', EventController.deleteStudent);
Route.get('/getcountongender', EventController.getcountongender);
Route.get('/totalrevenuebydept', EventController.totalrevenuebydept);
Route.get('/totalrevenuebygender', EventController.totalrevenuebygender);
Route.get('/getcampusanddeptbasedcount', EventController.getcampusanddeptbasedcount);
Route.get('/countonhostelandnonhostel', EventController.countonhostelandnonhostel);

// User registration routes
// Route.post('/register', Userregistration.registerUser);
// Route.post('/resetpassword', Userregistration.resetPassword);
// Route.post('/login', Userregistration.loginUser);

//users
Route.post("/signup", UsersController.signup);
Route.post("/login", UsersController.login);
Route.post("/reset-password",UsersController.resetPassword);
Route.post("/logout", UsersController.logout);
Route.post("/sendotp", UsersController.sendOtp);
Route.post("/verifyotp", UsersController.verifyOtp);    
module.exports = Route;