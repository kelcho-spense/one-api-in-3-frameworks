import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, Index, UpdateDateColumn, CreateDateColumn } from "typeorm";
import { Comment } from "./Comment";
import { Profile } from "./Profile";
import { Author } from "./Author";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    firstName: string;

    @Column('varchar', { length: 20 })
    lastName: string;

    @Index('IDX_USER_EMAIL', { unique: true }) // adding index for email: helps with performance on lookups
    @Column('varchar', { length: 100, unique: true })
    email: string;

    // 1-n relations : user has many comments
    @OneToMany(() => Comment, (c) => c.user)
    comments: Comment[];

      // Use SQL Server compatible datetime type and do NOT specify a length
    @CreateDateColumn({ type: 'datetime2' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime2' })
    updatedAt: Date;

    // 1-1 relations: user has one profile
    @OneToOne(() => Profile, (p) => p.user, { cascade: true })
    profile: Profile;
    // 1-1 relations: user has one author
    @OneToOne(() => Author, (a) => a.user, { cascade: true })
    author: Author;

}
