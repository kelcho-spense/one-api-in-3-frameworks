
import { Blog } from '../entity/Blog';
import { Category } from '../entity/Category';
import { Repository, In } from 'typeorm';
import AppDataSource from '../data-source';

// using repository pattern: service to handle blog-related DB operations
class BlogService {
    private blogRepository: Repository<Blog>;

    constructor() {
        this.blogRepository = AppDataSource.getRepository(Blog);
    }

    async findAll(): Promise<Blog[]> {
        return await this.blogRepository.find({
            relations: ['author', 'author.user', 'comments', 'categories']
        });
    }

    async findById(id: string): Promise<Blog | null> {
        return await this.blogRepository.findOne({
            where: { id },
            relations: ['author', 'author.user', 'comments', 'categories']
        });
    }

    async createBlog(blogData: Partial<Blog> & { categoryIds?: string[] }): Promise<Blog> {
        const { categoryIds, ...restBlogData } = blogData;

        // Create blog
        const blog = this.blogRepository.create(restBlogData);

        // If categoryIds are provided, fetch and attach categories
        if (categoryIds && categoryIds.length > 0) {
            const categories = await AppDataSource.getRepository(Category).find({
                where: { id: In(categoryIds) }
            }) as Category[];
            blog.categories = categories;
        } return await this.blogRepository.save(blog);
    }

    async updateBlog(id: string, blogData: Partial<Blog> & { categoryIds?: string[] }): Promise<Blog | null> {
        const blog = await this.blogRepository.findOne({
            where: { id },
            relations: ['categories']
        });

        if (!blog) {
            return null;
        }

        const { categoryIds, ...restBlogData } = blogData;

        // If categoryIds are provided, fetch and update categories
        if (categoryIds !== undefined) {
            if (categoryIds.length > 0) {
                const categories = await AppDataSource.getRepository(Category).find({
                    where: { id: In(categoryIds) }
                }) as Category[];
                blog.categories = categories;
            } else {
                blog.categories = [];
            }
        } this.blogRepository.merge(blog, restBlogData);
        return await this.blogRepository.save(blog);
    }

    async deleteBlog(id: string): Promise<boolean> {
        const result = await this.blogRepository.delete(id);
        return result.affected !== 0;
    }
}

export default BlogService;
