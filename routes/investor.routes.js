import { Router } from 'express'
import Investor from '../models/investor.model'

import fileUpload from '../config/cloudinary.config.js'
import isAuthenticatedMiddleware from '../middlewares/isAuthenticatedMiddleware.js'

const investorRouter = Router()

investorRouter.post('/', isAuthenticatedMiddleware, async (req, res) => {
    const payload = req.body
    try {
        const newInvestor = await Investor.create(payload)
        return res.status(201).json(newInvestor)
    } catch (error) {
        console.log(error)
        if(error.name === 'ValidationError') {
            return res.status(422).json({message: "Validation error. Check your input."})
        }
        return res.status(500).json({message: "Error while creating movie"})
    }
})

nfRouter.get('/', isAuthenticatedMiddleware, async (req, res) => {
    const { year, order } = req.query
    const query = {}
    if(year) {
        query.year = year
    }
    try {
        const nf = await Nf.find(query)
                        .populate('cast' , 'name wikipediaLink -_id')
                        .sort(order)
        return res.status(200).json(movies)
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
})

nfRouter.get('/:id', isAuthenticatedMiddleware, async (req, res) => {
    const { id } = req.params
    try {
        const nf = await nf.findById(id)
            .populate('cast comments')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })
        if(!nf) {
            return res.status(404).json({message: 'Not Found'})
        }
        return res.status(200).json(movie)
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
})

nfRouter.put('/:id', isAuthenticatedMiddleware, async (req, res) => {
    const { id } = req.params
    const payload = req.body
    try {
        const updatedNf = await Nf.findOneAndUpdate({_id: id}, payload, { new: true })
        
        await Star.updateMany({_id: {$in: payload.cast}}, {$push: {movies: updatedMovie._id}})
        
        if(!updatedNf) {
            return res.status(404).json({message: 'Not Found'})
        }
        return res.status(200).json(updatedMovie)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal server error"})
    }
})

nfRouter.delete('/:id', isAuthenticatedMiddleware, async (req, res) => {
    const { id } = req.params
    try {
        await Nf.findOneAndDelete({_id: id})
        return res.status(204).json()
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
})

nfRouter.post("/upload", isAuthenticatedMiddleware, fileUpload.single('nfDocument'), (req, res) => {
    res.status(201).json({url: req.file.path})
})

export default nfRouter