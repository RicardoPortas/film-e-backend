import { Router } from 'express'
import Movie from '../models/movie.model.js'
import Star from '../models/star.model.js'
import Producer from '../models/producer.model.js'
import fileUpload from '../config/cloudinary.config.js'
import isAuthenticatedMiddleware from '../middlewares/isAuthenticatedMiddleware.js'
import permit from "../middlewares/authorizationNf.js"; 


const moviesRouter = Router()

moviesRouter.post('/', [isAuthenticatedMiddleware, permit("producer")], async (req, res) => {
    const userId = req.user.id 
    const payload = req.body
    try { //encontrar o id de um producer na collection de producers que tenha o Id do usuário logado. 
        const producer = await Producer.findOne({ userId }) // encontra o produtor correspondente ao usuário logado
        if (!producer) {
            return res.status(404).json({ message: "Producer not found for this user" })
        }
        const newMovie = await Movie.create(payload)
        return res.status(201).json(newMovie)
    } catch (error) {
        console.log(error)
        if(error.name === 'ValidationError') {
            return res.status(422).json({message: "Validation error. Check your input."})
        }
        return res.status(500).json({message: "Error while creating movie"})
    }
})

moviesRouter.get('/', isAuthenticatedMiddleware, async (req, res) => {
    const { title, order } = req.query
    const query = {}
    if(title) {
        query.title = title
    }
    try {
        console.log(query)
        const movies = await Movie.find(query)
                        .populate('cast Crew Producer comments')
                        .sort(order)
        return res.status(200).json(movies)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal server error"})
    }
})

moviesRouter.get('/:id', isAuthenticatedMiddleware, async (req, res) => {
    const { id } = req.params
    try {
        const movie = await Movie.findById(id)
            .populate('user comments')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })
        if(!movie) {
            return res.status(404).json({message: 'Not Found'})
        }
        return res.status(200).json(movie)
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
})
moviesRouter.put('/:id', [isAuthenticatedMiddleware, permit("producer")], async (req, res) => {
    const { id } = req.params
    const payload = req.body
    try {
        const updatedMovie = await Movie.findOneAndUpdate({_id: id}, payload, { new: true })
        
        await Star.updateMany({_id: {$in: payload.cast}}, {$push: {movies: updatedMovie._id}})
        
        if(!updatedMovie) {
            return res.status(404).json({message: 'Not Found'})
        }
        return res.status(200).json(updatedMovie)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal server error"})
    }
})
moviesRouter.delete('/:id', [isAuthenticatedMiddleware, permit("producer")], async (req, res) => {
    const { id } = req.params
    const userId = req.user.id 
    try {
        await Movie.findOneAndDelete({_id: id, user: userId})
        return res.status(204).json()
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
})

moviesRouter.post("/upload", isAuthenticatedMiddleware, fileUpload.single('moviePoster'), (req, res) => {
    res.status(201).json({url: req.file.path})
})

export default moviesRouter