import { Router, Request, Response } from 'express'
import AuthorService from './author.service'
import { createAuthorSchema, updateAuthorSchema, uuidParamSchema } from '../validationSchemas'
import { validate, validateParams } from '../middlewares'

const authorRouter: Router = Router()
const authorService = new AuthorService()

authorRouter.get('/authors', async (req: Request, res: Response) => {
    try {
        const authors = await authorService.findAll()
        res.status(200).json(authors)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch authors' });
    }
})

authorRouter.post('/authors', validate(createAuthorSchema), async (req: Request, res: Response) => {
    try {
        const authorData = req.body
        const newAuthor = await authorService.createAuthor(authorData)
        res.status(201).json(newAuthor)
    } catch (err: any) {
        // Handle specific errors (like duplicate or foreign key constraint)
        if (err?.number === 2627 || err?.message?.includes('duplicate')) {
            return res.status(409).json({ error: 'An author with this user already exists' });
        }
        if (err?.number === 547 || err?.message?.includes('FOREIGN KEY')) {
            return res.status(400).json({ error: 'Invalid user ID provided' });
        }
        res.status(500).json({ error: 'Failed to create author' });
    }
})

authorRouter.get('/authors/:id', validateParams(uuidParamSchema), async (req: Request, res: Response) => {
    const authorId = req.params.id!

    try {
        const author = await authorService.findById(authorId)
        if (!author) {
            return res.status(404).json({ error: 'Author not found' })
        }
        return res.status(200).json(author)
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch author' })
    }
})

authorRouter.put('/authors/:id', validateParams(uuidParamSchema), validate(updateAuthorSchema), async (req: Request, res: Response) => {
    const authorId = req.params.id!

    try {
        const authorData = req.body
        const updatedAuthor = await authorService.updateAuthor(authorId, authorData)
        if (!updatedAuthor) {
            return res.status(404).json({ error: 'Author not found' })
        }
        return res.status(200).json(updatedAuthor)
    } catch (err: any) {
        return res.status(500).json({ error: 'Failed to update author' })
    }
})

authorRouter.delete('/authors/:id', validateParams(uuidParamSchema), async (req: Request, res: Response) => {
    const authorId = req.params.id!

    try {
        const deleted = await authorService.deleteAuthor(authorId)
        if (!deleted) {
            return res.status(404).json({ error: 'Author not found' })
        }
        return res.status(204).end()
    } catch (err) {
        return res.status(500).json({ error: 'Failed to delete author' })
    }
})

export default authorRouter;
