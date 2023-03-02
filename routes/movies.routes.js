import { Router } from 'express'
import Movie from '../models/Movie.model.js'
import Star from '../models/Star.model.js'
import fileUpload from '../config/cloudinary.config.js'
import isAuthenticatedMiddleware from '../middlewares/isAuthenticatedMiddleware.js'

const moviesRouter = Router()

moviesRouter.post('/', isAuthenticatedMiddleware, async (req, res) => {
    const payload = req.body
    try {
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
    const { year, order } = req.query
    const query = {}
    if(year) {
        query.year = year
    }
    try {
        const movies = await Movie.find(query)
                        .populate('cast' , 'name wikipediaLink -_id')
                        .sort(order)
        return res.status(200).json(movies)
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
})

moviesRouter.get('/:id', isAuthenticatedMiddleware, async (req, res) => {
    const { id } = req.params
    try {
        const movie = await Movie.findById(id)
            .populate('cast comments')
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
moviesRouter.put('/:id', isAuthenticatedMiddleware, async (req, res) => {
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
moviesRouter.delete('/:id', isAuthenticatedMiddleware, async (req, res) => {
    const { id } = req.params
    try {
        await Movie.findOneAndDelete({_id: id})
        return res.status(204).json()
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
})

moviesRouter.post("/upload", isAuthenticatedMiddleware, fileUpload.single('moviePoster'), (req, res) => {
    res.status(201).json({url: req.file.path})
})

export default moviesRouter