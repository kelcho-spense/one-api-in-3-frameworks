
import { Author } from '../entity/Author';
import { Repository } from 'typeorm';
import AppDataSource from '../data-source';

// using repository pattern: service to handle author-related DB operations
class AuthorService {
    private authorRepository: Repository<Author>;

    constructor() {
        this.authorRepository = AppDataSource.getRepository(Author);
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

    async createAuthor(authorData: Partial<Author>): Promise<Author> {
        // Create author
        const author = this.authorRepository.create(authorData);
        return await this.authorRepository.save(author);
    }

    async updateAuthor(id: string, authorData: Partial<Author>): Promise<Author | null> {
        const author = await this.authorRepository.findOne({
            where: { id }
        });
        if (!author) {
            return null;
        }
        this.authorRepository.merge(author, authorData);
        return await this.authorRepository.save(author);
    }

    async deleteAuthor(id: string): Promise<boolean> {
        const result = await this.authorRepository.delete(id);
        return result.affected !== 0;
    }
}

export default AuthorService;
