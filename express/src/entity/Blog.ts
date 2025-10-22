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
    @Column({ nullable: true })
    slug?: string;

    @Column()
    title: string;

    @Column('text')
    content: string;

    @Index('IDX_BLOG_PUBLISHED')
    @Column({ default: false })
    published: boolean;

    @Column({ nullable: true })
    excerpt?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Index('IDX_BLOG_AUTHOR')
    @ManyToOne(() => Author, (author) => author.blogs, { onDelete: 'SET NULL' })
    author: Author;

    @OneToMany(() => Comment, (comment) => comment.blog)
    comments: Comment[];

    @ManyToMany(() => Category, (category) => category.blogs)
    @JoinTable()
    categories: Category[];
}

