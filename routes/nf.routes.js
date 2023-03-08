import { Router } from 'express'
import User from '../models/user.model.js'
import Producer from '../models/producer.model.js'
import Professional from '../models/professional.model.js'
import Nf from '../models/nf.model.js'
import Movie from '../models/movie.model.js'
import isAuthenticatedMiddleware from '../middlewares/isAuthenticatedMiddleware.js'
import permit from "../middlewares/authorization.js"; 

import fileUpload from '../config/cloudinary.config.js'

const nfRouter = Router()

nfRouter.post('/', [isAuthenticatedMiddleware, permit("professional", "producer")], async (req, res) => {
    const payload = req.body
    try {
        const newNf = await Nf.create({...payload, producer: req.user.id})
        return res.status(201).json(newNf)
    } catch (error) {
        console.log(error)
        if(error.name === 'ValidationError') {
            return res.status(422).json({message: "Validation error. Check your input."})
        }
        return res.status(500).json({message: "Error while creating Invoice"})
    }
})

nfRouter.get('/',[isAuthenticatedMiddleware, permit("professional", "producer")], async (req, res) => {
    const { year, order } = req.query
    const query = {}
    if(year) {
        query.year = year
    }
    try {
        const nf = await Nf.find(query)
                        .populate('cast' , 'name wikipediaLink -_id')
                        .sort(order)
        return res.status(200).json(nf)
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
})

nfRouter.get('/:id', [isAuthenticatedMiddleware, permit("professional", "producer")], async (req, res) => {
    const { id } = req.params
    try {
        const nf = await nf.findById(id)
        if(!nf) {
            return res.status(404).json({message: 'Not Found'})
        }
        return res.status(200).json(nf)
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
})

nfRouter.put('/:id',[isAuthenticatedMiddleware, permit("producer")], async (req, res) => {
    const { id } = req.params
    const payload = req.body
    try {
        const updatedNf = await Nf.findOneAndUpdate({_id: id}, payload, { new: true })
                
        if(!updatedNf) {
            return res.status(404).json({message: 'Not Found'})
        }
        return res.status(200).json(updatedNf)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal server error"})
    }
})

nfRouter.delete('/:id',[isAuthenticatedMiddleware, permit("producer")], async (req, res) => {
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