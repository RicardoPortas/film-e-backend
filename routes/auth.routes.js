import { Router } from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'
import 'dotenv/config'
import jwt from 'jsonwebtoken'
import fileUpload from '../config/cloudinary.config.js'
import isAuthenticatedMiddleware from '../middlewares/isAuthenticatedMiddleware.js'

const authRouter = Router()

authRouter.post('/sign-up', async (req, res) => {
    const { email, password } = req.body

    try {

        const userExists = await User.findOne({email})
        if(userExists) {
            throw new Error('User exists')
        }

        const salt = bcrypt.genSaltSync(+process.env.SALT_ROUNDS)
        const passwordHash = bcrypt.hashSync(password, salt)

        const newUser = await User.create({ email, passwordHash })
        if(newUser) {
            return res.status(201).json({message: 'User Created'})
        }
    } catch (error) {
        console.log(error)

        if(error.message === 'User exists') {
            return res.status(409).json({message: 'Revise os dados enviados'})
        }
        return res.status(500).json({message: 'Internal Server Error'})
    }
})

authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body
    
    console.log(email, password)

    try {
        if(!email) {
            throw new Error('Empty e-mail')
        }
    
        if(!password) {
            throw new Error('Empty password')
        }

        const user = await User.findOne({email})

        if(!user) {
            throw new Error('User does not exists')
        }

        console.log(user)

        console.log('hash', password, user.passwordHash)

        const passwordMatch = bcrypt.compareSync(password, user.passwordHash)

        if(!passwordMatch) {
            throw new Error('Password does not match')
        }

        const secret = process.env.JWT_SECRET
        const expiresIn = process.env.JWT_EXPIRES

       
        const token = jwt.sign({id: user._id, email: user.email}, secret, {expiresIn})

        setTimeout(() => {
            try {
                const decoded = jwt.verify(token, secret)
                console.log('verificação: ', decoded)
            } catch (error) {
                console.log('erro: ', error)
            }
        }, 10000)
        
        return res.status(200).json({token})
    } catch (error) {
        console.log(error)
        return res.status(401).json({message: 'Unauthorized'})
    }
})

export default authRouter