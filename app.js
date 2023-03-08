import 'dotenv/config'
import express from "express"
import cors from 'cors'
import connectDb from './config/db.connection.js'
import moviesRouter from './routes/movies.routes.js'
import starsRouter from './routes/star.routes.js'
import producerRouter from './routes/producer.routes.js'
import investorRouter from './routes/investor.routes.js'
import professionalRouter from './routes/professional.routes.js'
import authRouter from './routes/auth.routes.js'
import nfRouter from './routes/nf.routes.js'
import commentsRouter from './routes/comments.routes.js'
import jwt from 'jsonwebtoken'

const app = express()
connectDb()

app.use(cors({ origin: process.env.REACT_URL }));
app.options("*", cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    app.use(cors());
    next();
});

app.use(express.json())
app.use('/movies', moviesRouter)
app.use('/stars', starsRouter)
app.use('/nf', nfRouter)
app.use('/comments',commentsRouter)
app.use('/producer',producerRouter)
app.use('/investor',investorRouter)
app.use('/professional', professionalRouter)
app.use(authRouter)

app.listen(process.env.PORT || 3001, () => console.log('Server listening on port: ', process.env.PORT || 3001))