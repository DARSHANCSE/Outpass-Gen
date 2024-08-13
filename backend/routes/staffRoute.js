import express from "express"
import { HODLogin,staffLogin,staffRegister,HODRegister} from "../controllers/staffController.js";
import { authMiddleWare } from "../middleware/auth.js";
import { gethodrequest } from "../controllers/outpassController.js";
import { HODForgetPassword, HODLogin,HODRegister,staffForgetPassword,staffLogin,staffRegister} from "../controllers/staffController.js";
import { authMiddleWare } from "../middleware/auth.js";
import { getStaffRequests } from "../controllers/outpassController.js";
const staffRouter = express.Router();

staffRouter.post("/stafflogin",staffLogin)
staffRouter.post("/HODlogin",HODLogin)
staffRouter.post("/register",staffRegister)
staffRouter.post("/hodregister",HODRegister)
staffRouter.get("/hodrequest",authMiddleWare,gethodrequest)
staffRouter.get("/staffrequests",authMiddleWare,getStaffRequests)
staffRouter.post("/hodforgotpass",authMiddleWare,HODForgetPassword)
staffRouter.post("/staffforgotpass",authMiddleWare,staffForgetPassword)

export {staffRouter}