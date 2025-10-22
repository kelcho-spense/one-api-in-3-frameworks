import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToMany } from 'typeorm';
import { Blog } from './Blog';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index('IDX_CATEGORY_NAME', { unique: true })
    @Column({ unique: true })
    name: string;

    @Index('IDX_CATEGORY_SLUG', { unique: true })
    @Column({ unique: true })
    slug: string;

    @Column({ nullable: true })
    description?: string;

    @ManyToMany(() => Blog, (blog) => blog.categories)
    blogs: Blog[];
}
