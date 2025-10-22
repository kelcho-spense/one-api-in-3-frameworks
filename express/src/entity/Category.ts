import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Blog } from './Blog';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index('IDX_CATEGORY_NAME', { unique: true })
    @Column({ unique: true, type: 'varchar', length: 100 })
    name: string;

    @Index('IDX_CATEGORY_SLUG', { unique: true })
    @Column({ unique: true, type: 'varchar', length: 150 })
    slug: string;

    @Column({ nullable: true, type: 'text' })
    description?: string;

      // Use SQL Server compatible datetime type and do NOT specify a length
    @CreateDateColumn({ type: 'datetime2' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime2' })
    updatedAt: Date;

    @ManyToMany(() => Blog, (blog) => blog.categories)
    blogs: Blog[];
}
