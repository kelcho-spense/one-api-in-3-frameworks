import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    OneToMany,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from './User';
import { Blog } from './Blog';

@Entity('authors')
export class Author {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    biography: string;

    @Column({ nullable: true, type: 'uuid'})
    userId: string;

     // Use SQL Server compatible datetime type and do NOT specify a length
    @CreateDateColumn({ type: 'datetime2' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime2' })
    updatedAt: Date;

    @OneToOne(() => User, (user) => user.author)
    @JoinColumn()
    user: User;

    @OneToMany(() => Blog, (blog) => blog.author)
    blogs: Blog[];
}
