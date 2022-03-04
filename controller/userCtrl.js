const Users = require('../model/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userCtrl  = {
    register: async (req,res)=>{
        try {
            const {name,email,password} = req.body
            const user = await Users.findOne({email})
            if(user) return res.status(400).json({msg:"This email already exist"})
            const hashPassword = await bcrypt.hash(password,10)
            const newUser = new Users({
                name,email,password:hashPassword
            })
            await newUser.save()
            const accestoken = createAccessToken({id:newUser._id})
            res.json({accestoken})
        } catch (error) {
            return res.status(500).json(error)
        }
    },
    login: async (req,res)=>{
        try {
            const {email,password} = req.body
            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg:"User does not exsit"})
            
            const isMatch = await bcrypt.compare(password,user.password)
            if(!isMatch) return res.status(400).json({msg:"Pasword Incorrect"})

            const accestoken = createAccessToken({id:user.id})
            const refreshtoken = createRefreshToken({id:user.id})
            res.cookie('refreshtoken',refreshtoken,{
                httpOnly:true,
                path:'/user/refresh_Token'
            })

            res.json({accestoken})

        } catch (error) {
            return res.status(500).json(error)
        }
    },
    logout: async (req,res)=>{
        try {
            res.clearCookie('refreshtoken',{path:'/user/refresh_Token'})
            return res.json({msg:'Logged out'})
        } catch (error) {
            return res.status(500).json(error)
        }
    },
    refreshToken: (req,res)=>{ 
        try {
            const rf_token = req.cookies.refreshtoken
            if(!rf_token) return res.status(400).json({msg:'Please login or register'})
            jwt.verify(rf_token,process.env.REFRESH_TOKEN,(err,user)=>{
                if(err) return res.status(400).json({msg:'Please login or register'})
                const accestoken = createAccessToken({id:user.id})
                res.json({user,accestoken})
            })
        } catch (error) {
            return res.status(500).json(error)
        }
    },
    getUser: async (req,res)=>{
        try {
            const user = await Users.findById(req.user.id).select('-password')
            if(!user) return res.status(400).json({msg:'user does not exist'})
            res.json(user)
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}

const createAccessToken = (user)=>{
    return jwt.sign(user,process.env.ACCESS_TOKEN,{expiresIn:'1d'})
}
const createRefreshToken = (user)=>{
    return jwt.sign(user,process.env.REFRESH_TOKEN,{expiresIn:'7d'})
}

module.exports = userCtrl