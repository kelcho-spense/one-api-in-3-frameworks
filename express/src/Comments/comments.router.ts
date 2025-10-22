import { Router, Request, Response } from 'express'
import CommentService from './comments.service'
import { createCommentSchema, updateCommentSchema, uuidParamSchema } from '../validationSchemas'
import { validate, validateParams } from '../middlewares'

const commentRouter: Router = Router()
const commentService = new CommentService()

commentRouter.get('/comments', async (req: Request, res: Response) => {
    try {
        const comments = await commentService.findAll()
        res.status(200).json(comments)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
})

commentRouter.post('/comments', validate(createCommentSchema), async (req: Request, res: Response) => {
    try {
        const commentData = req.body
        const newComment = await commentService.createComment(commentData)
        res.status(201).json(newComment)
    } catch (err: any) {
        // Handle specific errors (like foreign key constraint)
        if (err?.number === 547 || err?.message?.includes('FOREIGN KEY')) {
            return res.status(400).json({ error: 'Invalid user ID or blog ID provided' });
        }
        res.status(500).json({ error: 'Failed to create comment' });
    }
})

commentRouter.get('/comments/:id', validateParams(uuidParamSchema), async (req: Request, res: Response) => {
    const commentId = req.params.id!

    try {
        const comment = await commentService.findById(commentId)
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' })
        }
        return res.status(200).json(comment)
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch comment' })
    }
})

commentRouter.put('/comments/:id', validateParams(uuidParamSchema), validate(updateCommentSchema), async (req: Request, res: Response) => {
    const commentId = req.params.id!

    try {
        const commentData = req.body
        const updatedComment = await commentService.updateComment(commentId, commentData)
        if (!updatedComment) {
            return res.status(404).json({ error: 'Comment not found' })
        }
        return res.status(200).json(updatedComment)
    } catch (err: any) {
        return res.status(500).json({ error: 'Failed to update comment' })
    }
})

commentRouter.delete('/comments/:id', validateParams(uuidParamSchema), async (req: Request, res: Response) => {
    const commentId = req.params.id!

    try {
        const deleted = await commentService.deleteComment(commentId)
        if (!deleted) {
            return res.status(404).json({ error: 'Comment not found' })
        }
        return res.status(204).end()
    } catch (err) {
        return res.status(500).json({ error: 'Failed to delete comment' })
    }
})

export default commentRouter;
