import { Router } from 'express'
import Producer from '../models/producer.model.js'
import Professional from '../models/professional.model.js'
import Budget from '../models/budget.model.js'
import Nf from '../models/nf.model.js'
import Movie from '../models/movie.model.js'
import isAuthenticatedMiddleware from '../middlewares/isAuthenticatedMiddleware.js'
import permit from "../middlewares/authorizationNf.js"; 

import fileUpload from '../config/cloudinary.config.js'

const nfRouter = Router()

nfRouter.post('/', [isAuthenticatedMiddleware, permit("professional", "producer")], async (req, res) => {
    const userId = req.user.id 
    const { movieId } = req.params
    const { budgetId } = req.params
    const payload = req.body
    try {
        const producer = await Producer.findOne({ userId }) // encontra o produtor correspondente ao usuário logado
        if (!producer) {
            return res.status(404).json({ message: "Producer not found for this user" })
        } else { const professional = await Professional.findOne({ userId })
        if (!professional) {
            return res.status(404).json({ message: "Professional not found for this user" })
        }
        }
        const newNf = await Nf.create({...payload, producer: req.user.id, professional: req.user.id, movie: movieId, budget: budgetId})
        const budget = await Budget.findOneAndUpdate({budget: budgetId}, {$push: {nf: newNf._id}})
        const movie = await Movie.findOneAndUpdate({_id: movieId}, {$push: {nf: newNf._id}})
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
    const { invoiceDate, order } = req.query
    const query = {}
    if(invoiceDate) {
        query.invoiceDate = invoiceDate
    }
    try {
        const nf = await Nf.find(query)
                        .populate('invoiceDate' , 'movie_id')
                        .sort(order)
        return res.status(200).json(nf)
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
})

nfRouter.get('/:id', [isAuthenticatedMiddleware, permit("professional", "producer")], async (req, res) => {
    const { id } = req.params
    try {
        const nf = await Nf.findById(id)
        if(!nf) {
            return res.status(404).json({message: 'Not Found'})
        }
        return res.status(200).json(nf)
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
})

nfRouter.put('/:id',[isAuthenticatedMiddleware, permit("producer", "professional")], async (req, res) => {
    const userId = req.user.id 
    const { id } = req.params
    const payload = req.body
    try {
        const updatedNf = await Nf.findOneAndUpdate({_id: id, user: userId}, payload, { new: true })
                
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

nfRouter.post("/nfUpload", isAuthenticatedMiddleware, fileUpload.single('nfImage'), (req, res) => {
    res.status(201).json({url: req.file.path})
})


export default nfRouter