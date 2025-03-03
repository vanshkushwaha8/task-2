 import { comparePasword, hashedPassword } from '../helpers/authhelper.js';
import userModel from '../models/userModel.js';
import JWT from 'jsonwebtoken'

 
 export const registerController = async(req,res)=>{
    try {
        
        const{name,email,password,phone,address} = req.body
        if(!name){
            return res.send({error:'The name is required'})
        }
        if(!email){
            return res.send({error:'The email is required'})
        }
        if(!password){
            return res.send({error:'The pasword is required'})
        }
        if(!phone){
            return res.send({error:'The phone is required'})
        }
        if(!address){
            return res.send({error:'The adddress is required'})
        }

        //check existing user
        const existingUser = await userModel.findOne({email})
   
        //condition for existing user
        if(existingUser){
            return res.status(500).send({
               success:true,
               message:'Already Register Please login',
               
            })
        }
        const existingContactUser = await userModel.findOne({phone})
   
        //condition for existing user
        if(existingContactUser){
            return res.status(500).send({
               success:true,
               message:'Already Register with this Contact Please login',
               
            })
        }
        // hashed password
        const hashedPasswords = await hashedPassword(password)
        const user = await new userModel({name,email,phone, address,password:hashedPasswords}).save()

        //user register
        res.status(201).send({
            success:true,
            message:"User register successfully",
            user
        })

        //catch of register
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:true,
            message:'Error in registration',
            error
        })
    }
}
//Method Post Login
export const loginController =async (req,res)=>{
    try {
        const {email,password} =  req.body
        //validation
        if(!email || !password){
           return  res.status(404).send({
                success:false,
                message:'Invalid Email And Password',
                
            })
        }
     //check the user is registered user or not
     const user = await userModel.findOne({email})
     if(!user){
        return res.status(404).send({
            success:false,
            message:'Email is not Registered'
        })
     }
    //comparing the compare password
      const match = await comparePasword(password,user.password) 
      if(!match){
        return res.status(200).send({
            success:false,
            message:'Inccorect password'
        })
      }
      //create jwt token 
      const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({
        success:true,
        message:"Login Successfully",
        user:{
            _id: user._id,
            name:user.name,
            email:user.email,
            phone:user.phone,
            address:user.address,
        }
        ,token
      })
      //catch of login
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Login Failed',
            error
        })
    }
}
