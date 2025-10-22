import "reflect-metadata"
import express from 'express'
import AppDataSource from './data-source'
import userRouter from './User/user.router'

const app = express()
const port = 8000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// middleware to parse JSON bodies
app.use(express.json())

// routes
app.use('/api', userRouter)




app.listen(port, () => {
  // Initialize database connection
  AppDataSource.initialize().then(() => {
    console.log("Database connected successfully")
  }).catch(error => console.log("Database connection failed: ", error))

  console.log(`Example app listening on port ${port}`)
})
