import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    OneToMany,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';
import { User } from './User';
import { Blog } from './Blog';

@Entity('authors')
export class Author {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    penName?: string;

    @Column({ nullable: true, type: 'text' })
    biography?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(() => User, (user) => user.author)
    @JoinColumn()
    user: User;

    @OneToMany(() => Blog, (blog) => blog.author)
    blogs: Blog[];
}
