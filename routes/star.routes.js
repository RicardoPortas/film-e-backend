import { Router } from 'express'
import Star from '../models/star.model.js'
import fileUpload from '../config/cloudinary.config.js'
import isAuthenticatedMiddleware from '../middlewares/isAuthenticatedMiddleware.js'

const starsRouter = Router()

starsRouter.post('/', isAuthenticatedMiddleware, async (req, res) => {
    const payload = req.body
    try {
        const newStar = await Star.create(payload)
        return res.status(201).json(newStar)
    } catch (error) {console.log(error)
        if(error.name === 'ValidationError') {
            return res.status(422).json({message: "Validation error. Check your input."})
        }
        return res.status(500).json({message: "Error while creating movie"})
    }
})

starsRouter.get('/', isAuthenticatedMiddleware, async (req, res) => {
    try {
        const stars = await Star.find({}).populate('movies', 'title -_id')
        return res.status(200).json(stars)
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
})

starsRouter.get('/:id', isAuthenticatedMiddleware, async (req, res) => {
    const { id } = req.params
    try {
        const star = await Star.findById(id)
        if(!star) {
            return res.status(404).json({message: 'Not Found'})
        }
        return res.status(200).json(star)
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
})
starsRouter.put('/:id', isAuthenticatedMiddleware, async (req, res) => {
    const { id } = req.params
    const payload = req.body
    try {
        const updatedStar = await Star.findOneAndUpdate({_id: id}, payload, { new: true })
        if(!updatedStar) {
            return res.status(404).json({message: 'Not Found'})
        }
        return res.status(200).json(updatedStar)
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
})
starsRouter.delete('/:id', isAuthenticatedMiddleware, async (req, res) => {
    const { id } = req.params
    try {
        await Star.findOneAndDelete({_id: id})
        return res.status(204).json()
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
})

starsRouter.post("/starUpload", isAuthenticatedMiddleware, fileUpload.single('starPicture'), (req, res) => {
    res.status(201).json({url: req.file.path})
})

export default starsRouter