const admin=require("../controllers/admin_controller")
const auth=require("../utils/jwt&key")
const express=require("express")
const router=express.Router()

router.route("/signup").post(admin.SignUp)
router.route("/login").post(admin.login)
router.route("/dashboard").get(auth.verifyAuthToken,auth.authorize,admin.adminDashboard)
router.route("/graph").get(auth.verifyAuthToken,auth.authorize,admin.getHourlyRequestCounts)
router.route("/userDetails").get(auth.verifyAuthToken,auth.authorize,admin.userDetails)

module.exports=router