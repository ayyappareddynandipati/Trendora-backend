const { faker } = require('@faker-js/faker');
const {User} = require('../models/UserSchema');
const { transporter } = require('../config/nodemailer');

exports.createUser = async (req, res) => {
    try {
      const newUser = new User(req.body);
      await newUser.save();
      res.status(201).json({message:"user created successfully",data:newUser});
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  exports.insertBulk = async (req, res) => {
    try {
      console.log("Received request to insert bulk users"); // Debugging log
  
      const count = req.body.count || 100;
      console.log(`Generating ${count} users...`); // Log count
  
      const users = [];
      for (let i = 0; i < count; i++) {
        users.push({
          name: faker.person.fullName(),
          age: faker.number.int({ min: 18, max: 60 }),
          email: faker.internet.email(),
          password: faker.internet.password(),
          city: faker.location.city(),
        });
      }
  
      console.log("Inserting users into the database..."); // Debugging log
      const newUsers = await User.insertMany(users);
      console.log(`Successfully inserted ${newUsers.length} users`);
  
      res.status(201).json({
        message: "Users created successfully",
        totalUsers: newUsers.length,
        data: newUsers,
      });
    } catch (error) {
      console.error("Error inserting bulk users:", error.message);
      res.status(500).json({ message: "Error creating users", error: error.message });
    }
  };
  exports.getalldata=async(req,res)=>{
    try{
      const users=await User.find();
      res.status(201).json({users});
    }
    catch(err){
      res.status(500).json({message:err.message});
    }
  };
  exports.getbyid=async(req,res)=>{
    const user=await User.findById(req.params.id);
    if(!user) return res.status(404).json({message:"user not found"});
    res.status(200).json({user});
  }
  exports.updateuser=async(req,res)=>{
    const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true});
    if(!user) return res.status(404).json({message:"user not found"});
    res.status(200).json({user});
  };
  exports.sendmail = async (req, res) => {
    try {
        if (!req.body || !req.body.to || !req.body.subject || !req.body.text) {
            return res.status(400).json({ message: "Missing required fields: to, subject, text" });
        }

        const { to, subject, text } = req.body;

        const mailOptions = {
            from: "vinod783058@gmail.com",
            to,
            subject,
            text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);

        res.status(200).json({ message: "Email sent successfully", response: info.response });
    } catch (error) {
        console.error("Error sending email:", error.message);
        res.status(500).json({ message: "Error sending email", error: error.message });
    }
};
exports.getusersbycity=async(req,res)=>{
  try{
    const data=await User.aggregate(
      [
        { $group: { _id: "$city", count: { $sum: 1 } } },
        { $sort: { count: -1 } } // Sort descending
    ]
    );
    res.status(200).json({message:"User get the data",data});
  }
  catch(err){
    res.status(500).json({message:err.message});
  }
}