import { Router, Request, Response } from 'express'
import BlogService from './blogs.service'
import { createBlogSchema, updateBlogSchema, uuidParamSchema } from '../validationSchemas'
import { validate, validateParams } from '../middlewares'

const blogRouter: Router = Router()
const blogService = new BlogService()

blogRouter.get('/blogs', async (req: Request, res: Response) => {
    try {
        const blogs = await blogService.findAll()
        res.status(200).json(blogs)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch blogs' });
    }
})

blogRouter.post('/blogs', validate(createBlogSchema), async (req: Request, res: Response) => {
    try {
        const blogData = req.body
        const newBlog = await blogService.createBlog(blogData)
        res.status(201).json(newBlog)
    } catch (err: any) {
        // Handle specific errors (like duplicate slug or foreign key constraint)
        if (err?.number === 2627 || err?.message?.includes('duplicate')) {
            return res.status(409).json({ error: 'A blog with this slug already exists' });
        }
        if (err?.number === 547 || err?.message?.includes('FOREIGN KEY')) {
            return res.status(400).json({ error: 'Invalid author ID or category IDs provided' });
        }
        res.status(500).json({ error: 'Failed to create blog' });
    }
})

blogRouter.get('/blogs/:id', validateParams(uuidParamSchema), async (req: Request, res: Response) => {
    const blogId = req.params.id!

    try {
        const blog = await blogService.findById(blogId)
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' })
        }
        return res.status(200).json(blog)
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch blog' })
    }
})

blogRouter.put('/blogs/:id', validateParams(uuidParamSchema), validate(updateBlogSchema), async (req: Request, res: Response) => {
    const blogId = req.params.id!

    try {
        const blogData = req.body
        const updatedBlog = await blogService.updateBlog(blogId, blogData)
        if (!updatedBlog) {
            return res.status(404).json({ error: 'Blog not found' })
        }
        return res.status(200).json(updatedBlog)
    } catch (err: any) {
        if (err?.number === 2627 || err?.message?.includes('duplicate')) {
            return res.status(409).json({ error: 'A blog with this slug already exists' });
        }
        if (err?.number === 547 || err?.message?.includes('FOREIGN KEY')) {
            return res.status(400).json({ error: 'Invalid author ID or category IDs provided' });
        }
        return res.status(500).json({ error: 'Failed to update blog' })
    }
})

blogRouter.delete('/blogs/:id', validateParams(uuidParamSchema), async (req: Request, res: Response) => {
    const blogId = req.params.id!

    try {
        const deleted = await blogService.deleteBlog(blogId)
        if (!deleted) {
            return res.status(404).json({ error: 'Blog not found' })
        }
        return res.status(204).end()
    } catch (err) {
        return res.status(500).json({ error: 'Failed to delete blog' })
    }
})

export default blogRouter;
