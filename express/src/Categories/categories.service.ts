
import { Category } from '../entity/Category';
import { Repository } from 'typeorm';
import AppDataSource from '../data-source';

// using repository pattern: service to handle category-related DB operations
class CategoryService {
    private categoryRepository: Repository<Category>;

    constructor() {
        this.categoryRepository = AppDataSource.getRepository(Category);
    }

    async findAll(): Promise<Category[]> {
        return await this.categoryRepository.find({
            relations: ['blogs']
        });
    }

    async findById(id: string): Promise<Category | null> {
        return await this.categoryRepository.findOne({
            where: { id },
            relations: ['blogs']
        });
    }

    async createCategory(categoryData: Partial<Category>): Promise<Category> {
        // Create category
        const category = this.categoryRepository.create(categoryData);
        return await this.categoryRepository.save(category);
    }

    async updateCategory(id: string, categoryData: Partial<Category>): Promise<Category | null> {
        const category = await this.categoryRepository.findOne({
            where: { id }
        });
        if (!category) {
            return null;
        }
        this.categoryRepository.merge(category, categoryData);
        return await this.categoryRepository.save(category);
    }

    async deleteCategory(id: string): Promise<boolean> {
        const result = await this.categoryRepository.delete(id);
        return result.affected !== 0;
    }
}

export default CategoryService;
