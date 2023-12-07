const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const {generateAccessToken,generateRefeshToken} = require('../middlewares/jwt')
const { response } = require('express')
const {verifyAccessToken} = require('../middlewares/verifyToken')

const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname } = req.body
    if (!email || !password || !firstname || !lastname)
        return res.status(400).json({
            sucess: false,
            mess: 'Missing inputs'
        })

    const user = await User.findOne({ email })
    if (user) throw new Error('User has existed')
    else {
        const newUser = await User.create(req.body)
        return res.status(200).json({
            sucess: newUser ? true : false,
            mess : newUser ? 'Register is sucessfully. Please go login~': 'Something went wrong'
        })
    }
})

const login = asyncHandler(async (req, res) => {
    const { email, password} = req.body
    if (!email || !password)
        return res.status(400).json({
            sucess: false,
            mess: 'Missing inputs'
        })
//plain object
    const response =await User.findOne({email})
    if(response && await response.isCorrectPassword(password)){
        //Hide password and role in response
        const { password,role, ...userData } =  response.toObject()
        //Create token
        const accessToken =generateAccessToken(response._id, role)
        const refreshToken =generateRefeshToken(response._id)
        // Save refesh token to DB
        await User.findByIdAndUpdate(response._id, {refreshToken}, {new:true})
        //Save refresh token to Cookie
        res.cookie('refreshToken',refreshToken,{httpOnly: true, maxAge: 7*24*60*60*1000})
        return res.status(200).json({
            sucess: true,
            accessToken,
            userData
        })  
    }
    else{
        throw new Error(`Invalid credentials`)
    }
})

const getCurrent = asyncHandler(async (req, res) => {
    const { _id}= req.user
    const user = await User.findById( _id)
    return res.status(200).json({
        success: false,
        rs: user ? user : 'User not found'
    })
})

module.exports = {
    register,
    login,
    getCurrent
}