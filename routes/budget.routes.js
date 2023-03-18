import { Router } from 'express'
import Budget from '../models/budget.model.js'
import Producer from '../models/producer.model.js'
import Movie from '../models/movie.model.js'
import permit from "../middlewares/authorizationNf.js"; 
import fileUpload from '../config/cloudinary.config.js'
import isAuthenticatedMiddleware from '../middlewares/isAuthenticatedMiddleware.js'

const budgetRouter = Router()
 
budgetRouter.post('/movies/:movieId/budget',[isAuthenticatedMiddleware, permit("producer")], async (req, res) => {
    const { movieId } = req.params
    try {
        const payload = req.body
        const producer = await Producer.find({cnpj: payload.cnpj})
        const newBudget = await Budget.create({...payload, producer: producer[0]._id, movie: movieId})
        const movie = await Movie.findOneAndUpdate({_id: movieId}, {$push: {budget: newBudget._id}})
        return res.status(201).json(newBudget)
    } catch (error) {
        console.log(error)
        if(error.name === 'ValidationError') {
            return res.status(422).json({message: "Validation error. Check your input."})
        }
        return res.status(500).json({message: "Error while creating budget"})
    }
})

budgetRouter.get('/movies/:movieId/', [isAuthenticatedMiddleware, permit("professional", "producer", "investor")], async (req, res) => {
    const { invoiceDate, order } = req.query
    const query = {}
    if(invoiceDate) {
        query.invoiceDate = invoiceDate
    }
    try {
        const budget = await Budget.find(query)
                        .populate('budget')
                        .sort(order)
        return res.status(200).json(budget)
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
})

budgetRouter.get('/movies/:movieId/:id', [isAuthenticatedMiddleware, permit("professional", "producer", "investor")], async (req, res) => {
    const { id } = req.params
    try {
        const budget = await budget.findById(id)
            .populate('nf')
            .populate({
                path: 'budget',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })
        if(!budget) {
            return res.status(404).json({message: 'Not Found'})
        }
        return res.status(200).json(budget)
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
})

budgetRouter.put('/:id', [isAuthenticatedMiddleware, permit("producer")], async (req, res) => {
    const { id } = req.params
    const payload = req.body
    const userId = req.user.id 
    try {
        const updatedBudget = await Budget.findOneAndUpdate({_id: id, user: userId}, payload, { new: true })
        
        await Nf.updateMany({_id: {$in: payload.cast}}, {$push: {nfs: updatedNf._id}})
        
        if(!updatedBudget) {
            return res.status(404).json({message: 'Not Found'})
        }
        return res.status(200).json(updatedBudget)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal server error"})
    }
})

budgetRouter.delete('/movies/:movieId/:id', isAuthenticatedMiddleware, async (req, res) => {
    const { id } = req.params
    const userId = req.user.id 
    try {
        await Budget.findOneAndDelete({_id: id, user: userId})
        return res.status(204).json()
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
})


export default budgetRouter