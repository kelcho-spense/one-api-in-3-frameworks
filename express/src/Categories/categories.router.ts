import { Router, Request, Response } from 'express'
import CategoryService from './categories.service'
import { createCategorySchema, updateCategorySchema, uuidParamSchema } from '../validationSchemas'
import { validate, validateParams } from '../middlewares'

const categoryRouter: Router = Router()
const categoryService = new CategoryService()

categoryRouter.get('/categories', async (req: Request, res: Response) => {
    try {
        const categories = await categoryService.findAll()
        res.status(200).json(categories)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
})

categoryRouter.post('/categories', validate(createCategorySchema), async (req: Request, res: Response) => {
    try {
        const categoryData = req.body
        const newCategory = await categoryService.createCategory(categoryData)
        res.status(201).json(newCategory)
    } catch (err: any) {
        // Handle specific errors (like duplicate name or slug)
        if (err?.number === 2627 || err?.message?.includes('duplicate')) {
            return res.status(409).json({ error: 'A category with this name or slug already exists' });
        }
        res.status(500).json({ error: 'Failed to create category' });
    }
})

categoryRouter.get('/categories/:id', validateParams(uuidParamSchema), async (req: Request, res: Response) => {
    const categoryId = req.params.id!

    try {
        const category = await categoryService.findById(categoryId)
        if (!category) {
            return res.status(404).json({ error: 'Category not found' })
        }
        return res.status(200).json(category)
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch category' })
    }
})

categoryRouter.put('/categories/:id', validateParams(uuidParamSchema), validate(updateCategorySchema), async (req: Request, res: Response) => {
    const categoryId = req.params.id!

    try {
        const categoryData = req.body
        const updatedCategory = await categoryService.updateCategory(categoryId, categoryData)
        if (!updatedCategory) {
            return res.status(404).json({ error: 'Category not found' })
        }
        return res.status(200).json(updatedCategory)
    } catch (err: any) {
        if (err?.number === 2627 || err?.message?.includes('duplicate')) {
            return res.status(409).json({ error: 'A category with this name or slug already exists' });
        }
        return res.status(500).json({ error: 'Failed to update category' })
    }
})

categoryRouter.delete('/categories/:id', validateParams(uuidParamSchema), async (req: Request, res: Response) => {
    const categoryId = req.params.id!

    try {
        const deleted = await categoryService.deleteCategory(categoryId)
        if (!deleted) {
            return res.status(404).json({ error: 'Category not found' })
        }
        return res.status(204).end()
    } catch (err) {
        return res.status(500).json({ error: 'Failed to delete category' })
    }
})

export default categoryRouter;
