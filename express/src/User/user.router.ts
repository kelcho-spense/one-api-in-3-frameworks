import { Router, Request, Response } from 'express'
import UserService from './user.service'
import { createUserSchema, updateUserSchema, uuidParamSchema } from '../validationSchemas'
import { validate, validateParams } from '../middlewares'

const userRouter: Router = Router()
const userService = new UserService()

userRouter.get('/users', async (req: Request, res: Response) => {
    try {
        const users = await userService.findAll()
        res.status(200).json(users)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
})

userRouter.post('/users', validate(createUserSchema), async (req: Request, res: Response) => {
    try {
        const userData = req.body
        const newUser = await userService.createUser(userData)
        res.status(201).json(newUser)
    } catch (err: any) {
        // Handle specific errors (like duplicate email)
        if (err?.number === 2627 || err?.message?.includes('duplicate')) {
            return res.status(409).json({ error: 'A user with this email already exists' });
        }
        res.status(500).json({ error: 'Failed to create user' });
    }
})

userRouter.get('/users/:id', validateParams(uuidParamSchema), async (req: Request, res: Response) => {
    const userId = req.params.id!

    try {
        const user = await userService.findById(userId)
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        return res.status(200).json(user)
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch user' })
    }
})

userRouter.put('/users/:id', validateParams(uuidParamSchema), validate(updateUserSchema), async (req: Request, res: Response) => {
    const userId = req.params.id!

    try {
        const userData = req.body
        const updatedUser = await userService.updateUser(userId, userData)
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' })
        }
        return res.status(200).json(updatedUser)
    } catch (err: any) {
        if (err?.number === 2627 || err?.message?.includes('duplicate')) {
            return res.status(409).json({ error: 'A user with this email already exists' });
        }
        return res.status(500).json({ error: 'Failed to update user' })
    }
})

userRouter.delete('/users/:id', validateParams(uuidParamSchema), async (req: Request, res: Response) => {
    const userId = req.params.id!

    try {
        const deleted = await userService.deleteUser(userId)
        if (!deleted) {
            return res.status(404).json({ error: 'User not found' })
        }
        return res.status(204).end()
    } catch (err) {
        return res.status(500).json({ error: 'Failed to delete user' })
    }
})

export default userRouter;

