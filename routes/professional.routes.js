import { Router } from 'express'
import Professional from '../models/professional.model.js'
import Movie from '../models/movie.model.js'
import permit from "../middlewares/authorizationNf.js"; 
import fileUpload from '../config/cloudinary.config.js'
import isAuthenticatedMiddleware from '../middlewares/isAuthenticatedMiddleware.js'

const professionalRouter = Router()

professionalRouter.post('/', [isAuthenticatedMiddleware, permit("professional")], async (req, res) => {
    const payload = req.body
    const userId = req.user.id 
    try {
        const newProfessional = await Professional.create({...payload, user: userId})
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
    const { nomeFantasia, order } = req.query
    const query = {}
    if(nomeFantasia) {
        query.nomeFantasia = nomeFantasia
    }
    try {
        const professional = await Professional.find(query)
                        .populate('nomeFantasia')
                        .sort(order)
        return res.status(200).json(professional)
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
})

professionalRouter.get('/:id', isAuthenticatedMiddleware, async (req, res) => {
    const { id } = req.params
    try {
        const professional = await Professional.findById(id)
            .populate('nomeFantasia')
        if(!professional) {
            return res.status(404).json({message: 'Not Found'})
        }
        return res.status(200).json(professional)
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
})

professionalRouter.put('/:id', [isAuthenticatedMiddleware, permit("professional")], async (req, res) => {
    const { id } = req.params
    const userId = req.user.id 
    const payload = req.body
    try {
        const updatedProfessional = await Professional.findOneAndUpdate({_id: id, user: userId}, payload, { new: true })
        
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
    const userId = req.user.id 
    try {
        await Professional.findOneAndDelete({_id: id, user: userId})
        return res.status(204).json()
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
})

professionalRouter.post("/professionalUpload", isAuthenticatedMiddleware, fileUpload.single('professionalDocument'), (req, res) => {
    res.status(201).json({url: req.file.path})
})

export default professionalRouter