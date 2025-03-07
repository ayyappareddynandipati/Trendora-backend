const Veda = require("../models/Veda");
const Payment=require("../models/payment");
exports.createUser = async (req, res) => {
    try {
        const veda = new Veda(req.body);
        await veda.save();
        res.status(201).json({ message: "User Created Successfully", data: veda });
        console.log("User Created Successfully", veda);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.updateUserName = async () => {
    try {
        const result = await Veda.findOneAndUpdate(
            { userRollNumber: "22A91A61D1" }, 
            { $set: { userName: "RAM CHARAN" } }, 
            { new: true } 
        );

        if (!result) {
            console.log("Record not found!");
        } else {
            console.log("Record updated successfully:", result);
        }
    } catch (error) {
        console.error("Error updating record:", error.message);
    }
};

  
exports.deleteStudent = async (req, res) => {
   const data= await Veda.deleteMany({ userCollege: 'ACOE', userGender: 'Male' });
    res.send('Records deleted');
    res.status(200).json({ message:"Deleted Records Successfully", data:data });
  };
  exports.getcountongender= async (req, res) => {
    try {
        const maleCount = await Veda.countDocuments({ userGender: "Male" });
        const femaleCount = await Veda.countDocuments({ userGender: "Female" });
        return res.status(200).json({ male: maleCount, female: femaleCount });
    }
    catch(err) {
        return res.status(500).json({ message: err.message });
    }
};
exports.totalrevenuebydept = async (require, res) => {
    try {
        const data = await Veda.aggregate(
            [
                {
                    "$group": {
                        "_id": "$userEventCategory",
                        "totalRevenue": {
                            "$sum": {
                                "$multiply": ["$userTeamSize", 100]
                            }
                        }
                    }
                }
            ]
            );
        res.status(200).json({ data });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.totalrevenuebygender = async (require, res) => {
    try {
        const data = await Veda.aggregate(
            [
                {
                    "$group": {
                        "_id": "$userGender",
                        "revenue": {
                            "$sum": {
                                "$cond": {
                                    "if": {
                                        "$eq": ["$userGender", "male"]
                                    },
                                    "then": { "$multiply": ["$userTeamsize", 100] },
                                    "else": { "$multiply": ["$userTeamsize", 100] }
                                }
                            }
                        }
                    }
                }
            ]);
        res.status(200).json({ data });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getcampusanddeptbasedcount=async(req,res)=>{
    try{
        const data=await Veda.aggregate(
            [
                {
                  "$group": {
                    "_id": {
                      "campus": "$userCollege",
                      "department": "$userDepartment",
                      "gender": "$userGender"
                    },
                    "count": { "$sum": 1 }
                  }
                },
                {
                  "$group": {
                    "_id": {
                      "campus": "$_id.campus",
                      "department": "$_id.department"
                    },
                    "genderCounts": {
                      "$push": {
                        "gender": "$_id.gender",
                        "count": "$count"
                      }
                    }
                  }
                },
                {
                  "$project": {
                    "_id": 0,
                    "campus": "$_id.campus",
                    "department": "$_id.department",
                    "genderCounts": "$genderCounts"
                  }
                }
              ]);
        res.status(200).json({data});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};
exports.countonhostelandnonhostel=async(req,res)=>{
    try{
        const data=await Veda.aggregate(
            [
                {
                  "$group": {
                    "_id": {
                      "department": "$userDepartment",
                      "accommodation": "$userAccomodation"
                    },
                    "count": { "$sum": 1 }
                  }
                },
                {
                  "$project": {
                    "department": "$_id.department",
                    "accommodation": "$_id.accommodation",
                    "count": 1,
                    "_id": 0
                  }
                }
              ]
        )
        res.status(200).json({data});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}