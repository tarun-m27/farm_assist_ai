const User =require("../models/user_model")
const {generateApiKey,generateAuthToken}=require("../utils/jwt&key")
const RequestTracking = require('../models/RequestTracking');

exports.SignUp=async (req,res)=>{
    try{
        const {name,email,pass}=req.body
       
    if(!name || !email || !pass) return res.status(400).json({
        status:"fail",
        data:"name,email & password are compulsory"
    })
    

    const result=await User.create({
        name,email,password:pass,role:"admin"
    })

    const token=generateAuthToken(result._id)


    res.status(200).json({
        status:"success",
        data:"user created successfully",
        jwt:token
    })

    } catch(err){

      console.log(err)
      res.status(400).json({
        status:"fail",
        data:err.code==11000 ? "Account Already Exists With The Email" : "Something Went Wrong"
      })
    }
    
}


exports.login=async (req,res)=>{
    
    const { email, pass} = req.body;
    console.log(email,pass)
    if(!email || !pass) return res.status(400).json({
      status:"fail",
      data:"name,email & password are compulsory"
  })

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user || user.role!="admin") {
      return res.status(401).json({ error: "Invalid email" });
    }

    // Compare hashed password
    const isMatch = await user.comparePassword(pass);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid pas" });
    }

    // Generate JWT Token
    const token = generateAuthToken(user._id)

    res.status(200).json({
        status:"success",
        data:"Log In successfull",
        jwt:token
    })
  } catch (err) {
    console.error(err);
    res.status(500).json({ status:"success",data: "Server error" });
  }
    
}




exports.adminDashboard=async (req, res) => {
    try {
      
          // 1. Total Revenue Calculation
          const revenueResult = await User.aggregate([
            { $unwind: "$payments" },
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: "$payments.amount" }
              }
            }
          ]);
  
    //   // 2. Total Users Count
      const totalUsers = await User.countDocuments();
  
    //   // 3. API Users Count (users with apiKeyActive: true)
     const apiUsers = await User.countDocuments({ apiKeyActive: true });
  
      // 4. Growth Rate Calculation (compared to previous month)
      const now = new Date();
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
  
      const growthData = await User.aggregate([
        {
          $group: {
            _id: null,
            currentMonthCount: {
              $sum: {
                $cond: [
                  { $gte: ["$createdAt", new Date(now.getFullYear(), now.getMonth(), 1)] },
                  1,
                  0
                ]
              }
            },
            lastMonthCount: {
              $sum: {
                $cond: [
                  { 
                    $and: [
                      { $gte: ["$createdAt", new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1)] },
                      { $lt: ["$createdAt", new Date(now.getFullYear(), now.getMonth(), 1)] }
                    ]
                  },
                  1,
                  0
                ]
              }
            }
          }
        }
      ]);
  
      let growthRate = 0;
      if (growthData.length > 0 && growthData[0].lastMonthCount > 0) {
        growthRate = (
          ((growthData[0].currentMonthCount - growthData[0].lastMonthCount) / 
           growthData[0].lastMonthCount) * 100
        );
      }
  
      // Prepare final response
      const metrics = {
        totalRevenue: revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0,
        totalUsers:totalUsers-1,
        apiUsers,
        growthRate: parseFloat(growthRate.toFixed(2)) // Round to 2 decimal places
      };
  
      res.status(200).json({
        success: true,
        metrics
      });
  
    } catch (error) {
      console.error("Error fetching admin metrics:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch admin metrics"
      });
    }
  };




  exports.getHourlyRequestCounts = async (req, res) => {

    console.log("hitting graph api...")
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      
      const now = new Date();
  
      const result = await RequestTracking.aggregate([
        {
          $match: {
            timestamp: { $gte: startOfDay, $lte: now },
            requestType: { $in: ["website", "api"] } // Filter known types
          }
        },
        {
          $project: {
            localTime: {
              $dateAdd: {
                startDate: "$timestamp",
                unit: "minute",
                amount: 330 // IST = UTC+5:30
              }
            },
            requestType: 1
          }
        },
        {
          $project: {
            hour: { $hour: "$localTime" },
            requestType: 1
          }
        },
        {
          $group: {
            _id: { hour: "$hour", requestType: "$requestType" },
            count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: "$_id.hour",
            counts: {
              $push: {
                k: "$_id.requestType",
                v: "$count"
              }
            }
          }
        },
        {
          $project: {
            hr: "$_id",
            counts: { $arrayToObject: "$counts" }
          }
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                { hr: "$hr", website: 0, api: 0 },
                "$counts"
              ]
            }
          }
        },
        { $sort: { hr: 1 } }
      ]);
  
      // Edge case: Ensure all 24 hours are included (unlikely to miss due to $replaceRoot)
      const hourlyData = Array.from({ length: 24 }, (_, hr) => 
        result.find(item => item.hr === hr) || { hr, website: 0, api: 0 }
      );
      
      console.log("sending graph api responce...")

      res.status(200).json({status:"success",hourlyData});
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  };


exports.userDetails=async (req, res) => {
  try {
      // Fetch all users from the database
      const users = await User.find({ role: { $ne: "admin" } }).select('name payments apiUsageCount totalRemaining lastRequestAt');
      // Map users to the required format
      const userData = users.map(user => ({
          User: user.name,
          'User Type': user.payments.length > 0 ? 'Premium' : 'Normal',
          'Total API Calls': user.apiUsageCount+user.totalRemaining,
          'Remaining API Calls': user.totalRemaining,
          'Last Request': user.lastRequestAt ? user.lastRequestAt.toISOString() : 'Never'
      }));

      // Return JSON response
      res.status(200).json({status:"success",userData});
  } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};