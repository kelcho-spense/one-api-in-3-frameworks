import { Router, Request, Response } from 'express'

const router: Router = Router()

router.get('/users', (req: Request, res: Response) => {
    res.send('List of users')
})

