import { PrismaClient } from '@prisma/client'
import bcrypt from "bcryptjs"
import validator from "validator"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient();

const createToken = (id) =>{
    console.log(process.env.JWT_SECRET);
    return jwt.sign({id},process.env.JWT_SECRET);
}
const staffLogin = async (req,res)=>{
    const {email,password}=req.body

    try{
        const staff = await prisma.staff.findUnique({
            where:{
                email:email,
            }
        })
        console.log(email)

        if (!staff){
            return res.json({success:false,message:"staff not found"})

        }
        const match = await bcrypt.compare(password,staff.password)
        if (!match){
            return res.json({success:false,message:"pass mismatch"})
        }

        const token = createToken(staff.id)


        res.json({success:true,message:`bearer ${token}`})
    }
    catch(err){
        console.log(err)
        res.json({success:false,message:"errooor"})
    }
}


const HODLogin = async (req,res)=>{
    const {email,password}=req.body

    try{
        const HOD = await prisma.HOD.findUnique({
            where:{
                email:email,
            }
        })


        if (!HOD){
            return res.json({success:false,message:"HOD not found"})

        }
        const match = await bcrypt.compare(password,HOD.password)
        if (!match){
            return res.json({success:false,message:"pass mismatch"})
        }

        const token = createToken(HOD.id)


        res.json({success:true,message:`bearer${token}`})
    }
    catch(err){
        console.log(err)
        res.json({success:false,message:"error"})
    }
}
const staffRegister = async(req,res)=>{
    const {email,password,designation,section,name,year,department} = req.body;
    try{
        const exists = await prisma.staff.findUnique({
            where:{
                email:email
            }
        })
        if(exists){
            return res.json({success:false,message:"Student Already Found.Please Login"})
        }
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Enter valid email"});
        }
        if(password.length < 8){
            return res.json({success:false,message:"Password isn't strong"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password,salt);
        const newStaff = await prisma.staff.create({
            data:{
                email,
                password:hashedPass,
                designation,
                class:section,
                name,
                year,
                department
            }
        })
        res.json({success:true,data:newStaff})
    }catch(err){
        console.log(err);
        res.json({success:true,message:err})
    }
}

const HODRegister = async(req,res)=>{
    const {email,password,name,department} = req.body;
    try{
        const exists = await prisma.staff.findUnique({
            where:{
                email:email
            }
        })
        if(exists){
            return res.json({success:false,message:"Student Already Found.Please Login"})
        }
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Enter valid email"});
        }
        if(password.length < 8){
            return res.json({success:false,message:"Password isn't strong"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password,salt);
        const newHOD = await prisma.hOD.create({
            data:{
                email,
                password:hashedPass,
                name,
                department
            }
        })
        res.json({success:true,data:newHOD})
    }catch(err){
        console.log(err);
        res.json({success:true,message:err})
    }
}

const HODForgetPassword = async(req,res)=>{
    const {password} = req.body;
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password,salt);
        const updatedHOD = await prisma.hOD.update({
            where:{
                id:req.headers.id
            },data:{
                password:hashedPass
            }
        })
        res.json({success:true,message:"Password Updated"})
    }catch(err){
        console.log(err);
        res.json({success:false,message:err})
    }
}

const staffForgetPassword = async(req,res)=>{
    const {password} = req.body;
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password,salt);
        const updatedStaff = await prisma.staff.update({
            where:{
                id:req.headers.id
            },data:{
                password:hashedPass
            }
        })
        res.json({success:true,message:"Password Updated"})
    }catch(err){
        console.log(err);
        res.json({success:false,message:err})
    }
}




export {staffRegister,HODRegister,HODLogin,staffLogin}
export {staffRegister,HODRegister,staffLogin,HODLogin,staffForgetPassword,HODForgetPassword}
