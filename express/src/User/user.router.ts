import { Router, Request, Response } from 'express'
import UserService from './user.service'
const userRouter: Router = Router()
const userService = new UserService()

userRouter.get('/users', (req: Request, res: Response) => {
    const users = userService.findAll()
    res.status(200).json(users)
})

userRouter.post('/users', (req: Request, res: Response) => {
    const userData = req.body
    const newUser = userService.createUser(userData)
    res.status(201).json(newUser)
})

userRouter.get('/users/:id', (req: Request, res: Response) => {
    const userId = req.params.id
    if (!userId) {
        res.status(400).send('User ID is required')
        return
    }
    const user = userService.findById(userId)
    res.status(201).json(user)
})

userRouter.put('/users/:id', (req: Request, res: Response) => {
    const userId = req.params.id
    if (!userId) {
        res.status(400).send('User ID is required')
        return
    }
    const userData = req.body
    const updatedUser = userService.updateUser(userId, userData)
    if (!updatedUser) {
        res.status(404).send('User not found')
        return
    }
    res.status(200).json(updatedUser)
})

userRouter.delete('/users/:id', (req: Request, res: Response) => {
    const userId = req.params.id
    if (!userId) {
        res.status(400).send('User ID is required')
        return
    }

    const deleted = userService.deleteUser(userId)
    if (!deleted) {
        res.status(404).send('User not found')
        return
    }
    res.status(204).send(`User with id : ${userId} deleted successfully`)

})

export default userRouter

