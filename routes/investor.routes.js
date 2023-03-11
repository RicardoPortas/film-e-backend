import { Router } from 'express'
import Investor from '../models/investor.model.js'
import permit from "../middlewares/authorizationNf.js"; 
import fileUpload from '../config/cloudinary.config.js'
import isAuthenticatedMiddleware from '../middlewares/isAuthenticatedMiddleware.js'

const investorRouter = Router()

investorRouter.post('/', [isAuthenticatedMiddleware, permit("investor")], async (req, res) => {
    const payload = req.body
    const userId = req.user.id 
    console.log(userId)
    try {
        const newInvestor = await Investor.create({...payload, user: userId})
        return res.status(201).json(newInvestor)
    } catch (error) {
        console.log(error)
        if(error.name === 'ValidationError') {
            return res.status(422).json({message: "Validation error. Check your input."})
        }
        return res.status(500).json({message: "Error while creating Investor"})
    }
})

investorRouter.get('/', isAuthenticatedMiddleware, async (req, res) => {
    const { nomeFantasia, order } = req.query
    const query = {}
    if(nomeFantasia) {
        query.nomeFantasia = nomeFantasia
    }
    try {
        const investor = await Investor.find(query)
                        .populate('nomeFantasia')
                        .sort(order)
        return res.status(200).json(investor)
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
})

investorRouter.get('/:id', isAuthenticatedMiddleware, async (req, res) => {
    const { id } = req.params
    try {
        const investor = await Investor.findById(id)
            .populate('nomeFantasia')
        if(!investor) {
            return res.status(404).json({message: 'Not Found'})
        }
        return res.status(200).json(investor)
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
})

investorRouter.put('/:id', [isAuthenticatedMiddleware, permit("investor")], async (req, res) => {
    const { id } = req.params
    const userId = req.user.id 
    const payload = req.body
    try {
        const updatedInvestor = await Investor.findOneAndUpdate({_id: id, user: userId}, payload, { new: true })
                
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
    const userId = req.user.id 
    try {
        await Investor.findOneAndDelete({_id: id, user: userId})
        return res.status(204).json()
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
})

investorRouter.post("/upload", isAuthenticatedMiddleware, fileUpload.single('investorDocument'), (req, res) => {
    res.status(201).json({url: req.file.path})
})

export default investorRouter