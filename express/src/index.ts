import "reflect-metadata"
import express from 'express'
import AppDataSource from './data-source'
const app = express()
const port = 8000

app.get('/', (req, res) => {
  res.send('Hello World!')
})




app.listen(port, () => {

  // Initialize database connection
  AppDataSource.initialize().then(() => {
    console.log("Database connected successfully")
  }).catch(error => console.log("Database connection failed: ", error))

  console.log(`Example app listening on port ${port}`)
})
