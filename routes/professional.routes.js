import { Router } from 'express'
import User from '../models/user.model'
import Producer from '../models/producer.model.js'
import Professional from '../models/professional.model.js'
import Movie from '../models/movie.model.js'

import fileUpload from '../config/cloudinary.config.js'
import isAuthenticatedMiddleware from '../middlewares/isAuthenticatedMiddleware.js'

const professionalRouter = Router()

professionalRouter.post('/', isAuthenticatedMiddleware, async (req, res) => {
    const payload = req.body
    try {
        const newProfessional = await Professional.create(payload)
        return res.status(201).json(newProfessional)
    } catch (error) {
        console.log(error)
        if(error.name === 'ValidationError') {
            return res.status(422).json({message: "Validation error. Check your input."})
        }
        return res.status(500).json({message: "Error while creating Professional"})
    }
})

professionalRouter.get('/', isAuthenticatedMiddleware, async (req, res) => {
    const { name, order } = req.query
    const query = {}
    if(name) {
        query.name = name
    }
    try {
        const professional = await Professional.find(query)
                        .populate('movies' , 'title -_id')
                        .sort(order)
        return res.status(200).json(professional)
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
})

professionalRouter.get('/:id', isAuthenticatedMiddleware, async (req, res) => {
    const { id } = req.params
    try {
        const professional = await professional.findById(id)
            .populate('comments')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })
        if(!professional) {
            return res.status(404).json({message: 'Not Found'})
        }
        return res.status(200).json(professional)
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
})

professionalRouter.put('/:id', isAuthenticatedMiddleware, async (req, res) => {
    const { id } = req.params
    const payload = req.body
    try {
        const updatedProfessional = await Professional.findOneAndUpdate({_id: id}, payload, { new: true })
        
        await Movie.updateMany({_id: {$in: payload.name}}, {$push: {movies: updatedMovie._id}})
        
        if(!updatedProfessional) {
            return res.status(404).json({message: 'Not Found'})
        }
        return res.status(200).json(updatedProfessional)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal server error"})
    }
})

professionalRouter.delete('/:id', isAuthenticatedMiddleware, async (req, res) => {
    const { id } = req.params
    try {
        await Professional.findOneAndDelete({_id: id})
        return res.status(204).json()
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
})

professionalRouter.post("/upload", isAuthenticatedMiddleware, fileUpload.single('professionalDocument'), (req, res) => {
    res.status(201).json({url: req.file.path})
})

export default professionalRouter