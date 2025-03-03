import express from 'express'
import {registerController,loginController} from '../controllers/authController.js'
const router = express.Router();

//post method/register 
router.post('/register',registerController)

//post method/login
router.post('/login',loginController)


export default router;