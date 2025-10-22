import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    Timestamp,
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
    @Column({ default: false, type: 'bit' })
    isApproved: boolean;

   // Use SQL Server compatible datetime type and do NOT specify a length
    @CreateDateColumn({ type: 'datetime2' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime2' })
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.comments)
    user: User;

    @ManyToOne(() => Blog, (blog) => blog.comments)
    blog: Blog;
}
