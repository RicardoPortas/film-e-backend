import { Router } from 'express'
import User from '../models/user.model'
import Producer from '../models/producer.model'
import Company from '../models/company.model.js'
import Movie from '../models/movie.model.js'
import permit from "../middlewares/authorization.js"; 
 // middleware for checking if user's role is permitted to make request
import fileUpload from '../config/cloudinary.config.js'
import isAuthenticatedMiddleware from '../middlewares/isAuthenticatedMiddleware.js'

app.use("/api/private", permit("admin"));
app.use(["/api/foo", "/api/bar"], permit("producer", "professional"));

const budgetRouter = Router()
 
budgetRouter.post('/', [isAuthenticatedMiddleware, permit("producer")], async (req, res) => {
    const payload = req.body
    try {
        const newbudget = await budget.create(payload)
        return res.status(201).json(newBudget)
    } catch (error) {
        console.log(error)
        if(error.name === 'ValidationError') {
            return res.status(422).json({message: "Validation error. Check your input."})
        }
        return res.status(500).json({message: "Error while creating movie"})
    }
})

budgetRouter.get('/', [isAuthenticatedMiddleware, permit("professional", "producer", "investor")], async (req, res) => {
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

budgetRouter.get('/:id', [isAuthenticatedMiddleware, permit("professional", "producer", "investor")], async (req, res) => {
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
    try {
        const updatedBudget = await Budget.findOneAndUpdate({_id: id}, payload, { new: true })
        
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

budgetRouter.delete('/:id', isAuthenticatedMiddleware, async (req, res) => {
    const { id } = req.params
    try {
        await Budget.findOneAndDelete({_id: id})
        return res.status(204).json()
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
})

budgetRouter.post("/upload", isAuthenticatedMiddleware, fileUpload.single('budgetDocument'), (req, res) => {
    res.status(201).json({url: req.file.path})
})

export default budgetRouter