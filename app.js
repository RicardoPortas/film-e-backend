import 'dotenv/config'
import express from "express"
import cors from 'cors'
import connectDB from './config/db.connection.js'
import Movie from './models/Movie.model.js'
import Nf from './models/Nf.model.js'

const app = express()
connectDB()

app.use(express.json())
app.use(cors())
app.use(express.json())

app.post('/movies', async (req, res) => {
  const payload = req.body
  try {
        const newMovie = await Movie.create(payload) 
        return res.status(201).json(newMovie)
  } catch (error) {
      console.log(error.name)
      if(error.name === 'ValidationError'){
        return res.status(422).json({message: "Validation error. Check your input"})
      }
      return res.status(500).json ({message: "Error while creating movie"}) 
  }
})

app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find({})
    return res.status(200).json(movies)
  } catch (error) {
        return res.status(500).json({message: "internal server error"})
      }
})

app.get('/movies/:id', async (req, res) => {
  const { id } = req.params
  try {
    const movie = await Movie.findById(id)
    if(!movie) {
      return res.status(404).json('')
    }
  } catch (error) {
        return res.status(500).json({message: "internal server error"})
      }
})

app.delete('/movies/:id', async (req, res) => {
  const { id } = req.params
  try {
    await Movie.findOneAndDelete({_id: id})
    return res.status(204).json()
  } catch (error) {
        return res.status(500).json({message: "internal server error"})
      }
})

app.post('/nf', async (req, res) => {
    const payload = req.body
    try {
          const newNf = await Nf.create(payload) 
          return res.status(201).json(newNf)
    } catch (error) {
        console.log(error.name)
        if(error.name === 'ValidationError'){
        return res.status(422).json({message: "Validation error. Check your input"})
      }
        return res.status(500).json ({message: "Error while creating Nf"}) 
    }
  })

app.get('/nf', async (req, res) => {
    try {
      const nf = await Nf.find({})
      return res.status(200).json(nf)
    } catch (error) {
          return res.status(500).json({message: "internal server error"})
        }
  })

app.listen(process.env.PORT, () => console.log('Server listening on port: ', process.env.PORT))