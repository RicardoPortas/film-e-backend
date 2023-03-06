import { Router } from "express";
import Comment from '../models/comments.model.js'
import Movie from '../models/movie.model.js'
import isAuthenticatedMiddleware from '../middlewares/isAuthenticatedMiddleware.js'

const commentsRouter = Router()

commentsRouter.post('/movies/:movieId/comments', async (req, res) => {
    const { movieId } = req.params
    const payload = req.body
    try {
        const newComment = await Comment.create(payload)
        const movie = await Movie.findOneAndUpdate({_id: movieId}, {$push: {comments: newComment._id}})
        return res.status(201).json(newComment)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Internal Server Error'})
    }
})

commentsRouter.delete('/movies/:movieId/comments', isAuthenticatedMiddleware, async (req, res) => {
    const { id } = req.params
    const { movieId } = req.params
    try {
        await Comment.findOneAndDelete({_id: id})
        return res.status(204).json()
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
})

export default commentsRouter