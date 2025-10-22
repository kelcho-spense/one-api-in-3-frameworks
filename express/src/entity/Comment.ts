import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';
import { User } from './User';
import { Blog } from './Blog';

@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    content: string;

    @Index('IDX_COMMENT_APPROVED')
    @Column({ default: false })
    isApproved: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.comments)
    user: User;

    @ManyToOne(() => Blog, (blog) => blog.comments)
    blog: Blog;
}
