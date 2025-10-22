import "reflect-metadata"
import express, { NextFunction, Request, Response } from 'express'
import AppDataSource from './data-source'
import userRouter from './User/user.router'

const app = express()
const port = 8000

app.get('/api', (req, res) => {
  res.send('Hello World!')
})

// middleware 

app.use(express.json())// parse JSON bodies
app.use((err: Error, req:Request, res:Response , next: NextFunction) => {
  
  console.error(err.stack); // Log the error for debugging

  // Send a structured error response to the client
  res.status((err as any).statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});


// routes
app.use('/api', userRouter)




app.listen(port, () => {
  // Initialize database connection
  AppDataSource.initialize().then(() => {
    console.log("Database connected successfully")
  }).catch(error => console.log("Database connection failed: ", error))

  console.log(`Example app listening on port ${port}`)
})
