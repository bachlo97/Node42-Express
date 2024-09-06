import express from 'express'
import { getUser, login, loginFacebook, resetToken, signUp } from '../controllers/userCotroller.js'

const userRouter = express.Router()

userRouter.get("/get-user",getUser)

//signup
userRouter.post("/sign-up",signUp)

//login
userRouter.post("/login",login)

//login facebook
userRouter.post("/login-facebook",loginFacebook)

//refresh token
userRouter.post("/reset-token",resetToken)

export default userRouter
