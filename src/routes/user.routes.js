import { Router } from "express";
import UserFunction from "../controller/user.controller.js"
import { upload } from "../middleware/multer.middleware.js";
import {GetUserData} from "../middleware/UserDetial.middleware.js"
const router  = Router();

router.route('/register').post(upload.fields([
    {
        name:"avatar",
        maxCount:1
    },
    {
        name:"coverimage",
        maxCount:1
    }
]),UserFunction.UserRegister)

router.route('/login').post(UserFunction.UserLogin)
router.route('/logout').post( GetUserData , UserFunction.UserLogout)
router.route('/verifyUser').post(UserFunction.RefrestTokenVerfiy)
router.route('/getCurrentUser').get(GetUserData , UserFunction.CurrentUser)
router.route('/passwordChange').post(GetUserData , UserFunction.ChangeCurrentPassword)
router.route('/updateCurrentUser').post(GetUserData ,  UserFunction.UpdateUserDetails)
router.route('/updateAvatar').post(
    upload.single("avatar") ,
    GetUserData,
    UserFunction.UpdateAvatar
)

export default router;