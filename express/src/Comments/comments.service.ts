
import { Comment } from '../entity/Comment';
import { Repository } from 'typeorm';
import AppDataSource from '../data-source';

// using repository pattern: service to handle comment-related DB operations
class CommentService {
    private commentRepository: Repository<Comment>;

    constructor() {
        this.commentRepository = AppDataSource.getRepository(Comment);
    }

    async findAll(): Promise<Comment[]> {
        return await this.commentRepository.find({
            relations: ['user', 'blog']
        });
    }

    async findById(id: string): Promise<Comment | null> {
        return await this.commentRepository.findOne({
            where: { id },
            relations: ['user', 'blog']
        });
    }

    async createComment(commentData: Partial<Comment>): Promise<Comment> {
        // Create comment
        const comment = this.commentRepository.create(commentData);
        return await this.commentRepository.save(comment);
    }

    async updateComment(id: string, commentData: Partial<Comment>): Promise<Comment | null> {
        const comment = await this.commentRepository.findOne({
            where: { id }
        });
        if (!comment) {
            return null;
        }
        this.commentRepository.merge(comment, commentData);
        return await this.commentRepository.save(comment);
    }

    async deleteComment(id: string): Promise<boolean> {
        const result = await this.commentRepository.delete(id);
        return result.affected !== 0;
    }
}

export default CommentService;
