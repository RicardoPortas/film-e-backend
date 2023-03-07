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
        return res.status(500).json({message: "Error while creating investor"})
    }
})

investorRouter.get('/', isAuthenticatedMiddleware, async (req, res) => {
    const { nome, order } = req.query
    const query = {}
    if(nome) {
        query.nome = nome
    }
    try {
        const investor = await Investor.find(query)
                        .populate('nome' , 'sobrenome')
                        .sort(order)
        return res.status(200).json(investor)
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
})

investorRouter.get('/:id', isAuthenticatedMiddleware, async (req, res) => {
    const { id } = req.params
    try {
        const investor = await investor.findById(id)
            .populate('comments')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })
        if(!investor) {
            return res.status(404).json({message: 'Not Found'})
        }
        return res.status(200).json(investor)
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
})

investorRouter.put('/:id', isAuthenticatedMiddleware, async (req, res) => {
    const { id } = req.params
    const payload = req.body
    try {
        const updatedInvestor = await investor.findOneAndUpdate({_id: id}, payload, { new: true })
                
        if(!updatedInvestor) {
            return res.status(404).json({message: 'Not Found'})
        }
        return res.status(200).json(updatedInvestor)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal server error"})
    }
})

investorRouter.delete('/:id', isAuthenticatedMiddleware, async (req, res) => {
    const { id } = req.params
    try {
        await Investor.findOneAndDelete({_id: id})
        return res.status(204).json()
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
})

investorRouter.post("/upload", isAuthenticatedMiddleware, fileUpload.single('investorDocument'), (req, res) => {
    res.status(201).json({url: req.file.path})
})

export default investorRouter