import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, Index } from "typeorm";
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

    @Index('IDX_USER_EMAIL', { unique: true })
    @Column('varchar', { length: 100, unique: true })
    email: string;

    // relations
    @OneToMany(() => Comment, (c) => c.user)
    comments: Comment[];

    @OneToOne(() => Profile, (p) => p.user, { cascade: true })
    profile: Profile;

    @OneToOne(() => Author, (a) => a.user, { cascade: true })
    author: Author;

}
