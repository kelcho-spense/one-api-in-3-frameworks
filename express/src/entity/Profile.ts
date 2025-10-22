import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';

@Entity('profiles')
export class Profile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true, type: 'varchar', length: 100 })
    fullName?: string;

    @Column('text', { nullable: true })
    bio?: string;

    @Column('text', { nullable: true })
    avatarUrl?: string;

    // Use SQL Server compatible datetime type and do NOT specify a length
    @CreateDateColumn({ type: 'datetime2' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime2' })
    updatedAt: Date;

    // 1-1 relations: profile belongs to one user
    @OneToOne(() => User, (user) => user.profile)
    @JoinColumn()
    user: User;
}
