
import { Author } from '../entity/Author';
import { Repository } from 'typeorm';
import AppDataSource from '../data-source';
import { User } from '../entity/User';

// using repository pattern: service to handle author-related DB operations
class AuthorService {
    private authorRepository: Repository<Author>;
    private userRepository: Repository<User>;

    constructor() {
        this.authorRepository = AppDataSource.getRepository(Author);
        this.userRepository = AppDataSource.getRepository(User);
    }

    async findAll(): Promise<Author[]> {
        return await this.authorRepository.find({
            relations: ['user', 'blogs']
        });
    }

    async findById(id: string): Promise<Author | null> {
        return await this.authorRepository.findOne({
            where: { id },
            relations: ['user', 'blogs']
        });
    }

    async createAuthor(authorData: Partial<Author>): Promise<Author | null> {
        // First fetch the user entity
         if (!authorData.userId) {
            throw new Error('User ID is required');
        }
        const user = await this.userRepository.findOne({
            where: { id: authorData.userId }
        });

        if (!user) {
            throw new Error('User not found');
        }

        // Create author with proper relation
       const author = new Author();
        author.biography = authorData.biography || '';
        author.userId = authorData.userId;
        author.user = user;

        // Return the author with relations loaded
        const savedAuthor = await this.findById(author.id);
        if (!savedAuthor) {
            throw new Error('Failed to retrieve saved author');
        }
        
        return savedAuthor;
    }

    async updateAuthor(id: string, authorData: Partial<Author>): Promise<Author | null> {
        const author = await this.authorRepository.findOne({
            where: { id },
            relations: ['user']
        });

        if (!author) {
            return null;
        }

        // Update the biography if provided
        if (authorData.biography !== undefined) {
            author.biography = authorData.biography;
        }

        await this.authorRepository.save(author);

        // Return the updated author with relations loaded
        return await this.findById(id);
    }

    async deleteAuthor(id: string): Promise<boolean> {
        const result = await this.authorRepository.delete(id);
        return result.affected !== 0;
    }
}

export default AuthorService;
