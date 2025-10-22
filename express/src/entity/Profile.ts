import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';

@Entity('profiles')
export class Profile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    fullName?: string;

    @Column({ nullable: true })
    bio?: string;

    @Column({ nullable: true })
    avatarUrl?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(() => User, (user) => user.profile)
    @JoinColumn()
    user: User;
}
