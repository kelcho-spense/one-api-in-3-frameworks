import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    ManyToMany,
    JoinTable,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';
import { Author } from './Author';
import { Comment } from './Comment';
import { Category } from './Category';

@Entity('blogs')
@Index('IDX_BLOG_PUBLISHED_CREATEDAT', ['published', 'createdAt'])
export class Blog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index('IDX_BLOG_SLUG', { unique: true })
    @Column({ nullable: true, type: 'varchar', length: 150 })
    slug?: string;

    @Column({ type: 'varchar', length: 200 })
    title: string;

    @Column('text')
    content: string;

    @Index('IDX_BLOG_PUBLISHED') // adding index for published: helps with performance on lookups
    @Column({ default: false, type: 'bit' })
    published: boolean;

    @Column('text', { nullable: true })
    excerpt?: string;

  // Use SQL Server compatible datetime type and do NOT specify a length
    @CreateDateColumn({ type: 'datetime2' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime2' })
    updatedAt: Date;

    @Index('IDX_BLOG_AUTHOR') // adding index for author: helps with performance on lookups
    @ManyToOne(() => Author, (author) => author.blogs, { onDelete: 'SET NULL' })
    author: Author;

    // 1-n relations : blog has many comments
    @OneToMany(() => Comment, (comment) => comment.blog)
    comments: Comment[];

    // n-n relations : blog has many categories
    @ManyToMany(() => Category, (category) => category.blogs)
    @JoinTable()
    categories: Category[];
}

