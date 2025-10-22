# Blogging API Entity Design with TypeORM

This document describes a recommended data model for a blogging API using TypeORM. It includes entity definitions and relationship mappings for the following domain objects:

- Users
- Profiles
- Authors
- Blogs
- Comments
- Categories

The design includes one-to-one (1-1), one-to-many (1-n), and many-to-many (n-n) relationships and example TypeORM decorator usage for each entity.

## High-level relationship summary

1. User - Profile: One-to-One (1-1)
	 - Each `User` has exactly one `Profile` that contains profile metadata.
2. User - Author: One-to-One (1-1)
	 - A `User` can be an `Author`. Author contains publishing-related data.
3. Author - Blog: One-to-Many (1-n)
	 - An `Author` can write many `Blog` posts.
4. Blog - Comment: One-to-Many (1-n)
	 - A `Blog` can have many `Comment`s.
5. Blog - Category: Many-to-Many (n-n)
	 - `Blog`s can belong to multiple `Category` entries and vice-versa.
6. User - Comment: One-to-Many (1-n)
	 - A `User` can write many `Comment`s.

## Entity definitions (example TypeScript + TypeORM)

Below are compact, well-documented examples for each entity. Use these as a starting point and adapt fields to your needs.

### User

Key points:
- Acts as an authentication/authorization principal.
- Owns a one-to-one `Profile` and can be linked to an `Author`.

Example:

```ts
@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	username: string;

	@Column({ unique: true })
	email: string;

	@Column()
	passwordHash: string;

	@Column({ default: true })
	isActive: boolean;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	// One-to-One with Profile (cascades allow creating profile along user)
	@OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
	profile: Profile;

	// Optional One-to-One to Author (if the user is a content author)
	@OneToOne(() => Author, (author) => author.user, { cascade: true })
	author: Author;

	// Comments authored by this user
	@OneToMany(() => Comment, (comment) => comment.user)
	comments: Comment[];
}
```

### Profile

Key points:
- Stores public profile metadata (display name, bio, avatar, etc.).
- Owning side of the 1-1 relationship with `User`.

Example:

```ts
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

	// Owning side of the relation
	@OneToOne(() => User, (user) => user.profile)
	@JoinColumn()
	user: User;
}
```

### Author

Key points:
- Represents publishing-specific data for a `User`.
- Has many `Blog` posts.

Example:

```ts
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

	// Owning side of the User-Author one-to-one
	@OneToOne(() => User, (user) => user.author)
	@JoinColumn()
	user: User;

	// Author -> Blogs
	@OneToMany(() => Blog, (blog) => blog.author)
	blogs: Blog[];
}
```

### Blog

Key points:
- Primary content entity. Connected to `Author`, `Comment`, and `Category`.
- Many-to-many with `Category` using @JoinTable on the owning side.

Example:

```ts
@Entity('blogs')
export class Blog {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	title: string;

	@Column('text')
	content: string;

	@Column({ default: false })
	published: boolean;

	@Column({ nullable: true })
	excerpt?: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	// Many blogs to one author
	@ManyToOne(() => Author, (author) => author.blogs)
	author: Author;

	// Comments for this blog
	@OneToMany(() => Comment, (comment) => comment.blog)
	comments: Comment[];

	// Many-to-Many with categories; this side owns the join table
	@ManyToMany(() => Category, (category) => category.blogs)
	@JoinTable()
	categories: Category[];
}
```

### Comment

Key points:
- Linked to both `User` (author) and `Blog` (target).

Example:

```ts
@Entity('comments')
export class Comment {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column('text')
	content: string;

	@Column({ default: false })
	isApproved: boolean;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	// Who wrote the comment
	@ManyToOne(() => User, (user) => user.comments)
	user: User;

	// Which blog the comment belongs to
	@ManyToOne(() => Blog, (blog) => blog.comments)
	blog: Blog;
}
```

### Category

Key points:
- Simple tag-like entity for grouping blogs.

Example:

```ts
@Entity('categories')
export class Category {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	name: string;

	@Column({ nullable: true })
	description?: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@ManyToMany(() => Blog, (blog) => blog.categories)
	blogs: Blog[];
}
```

## Implementation notes & suggestions

- Use `uuid` primary columns for distributed-friendly IDs.
- Apply `cascade: true` on 1-1 relationships where you want convenience (create profile when creating user), but use carefully to avoid accidental deletes.
- Consider soft deletes for `Blog` and `Comment` if you need to preserve history.
- Add indexes on commonly queried columns (e.g., `slug`, `authorId`, `published`).
- Define DTOs and validation (class-validator) for input shapes.

## Example service snippet (UserService)

This is a small example demonstrating how to load a user with related entities using TypeORM repository API.

```ts
import { User } from '../entity/User.entity';
import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Profile } from '../entity/Profile.entity';

class UserService {
		private userRepository: Repository<User>;
		private profileRepository: Repository<Profile>;

		constructor() {
				this.userRepository = AppDataSource.getRepository(User);
				this.profileRepository = AppDataSource.getRepository(Profile);
		}

		async findAll(): Promise<User[]> {
				return await this.userRepository.find({
						relations: ['profile', 'author', 'comments']
				});
		}

		async findById(id: string): Promise<User | null> {
				return await this.userRepository.findOne({
						where: { id },
						relations: ['profile', 'author', 'comments']
				});
		}

		async createUser(userData: Partial<User>, profileData?: Partial<Profile>): Promise<User> {
				// Create user with optional profile
				const user = this.userRepository.create(userData);
        
				if (profileData) {
						const profile = this.profileRepository.create(profileData);
						profile.user = user;
						user.profile = profile;
				}

				return await this.userRepository.save(user);
		}

		// Additional methods would go here
}

export default UserService;

```

## Running migrations
- create an empty migration file (edit it manually)
```bash
pnpm run m-create
```
- auto-generate a migration (create from entity vs DB diff)
```bash
pnpm run m-generate
```
- run pending migrations
```bash
pnpm run m-run
```
- revert last executed migration
```bash
pnpm run m-revert
```
- synchronize database schema with entities (use with caution in production)
```bash
pnpm run db-sync
```
- drop the database schema
```bash
pnpm run db-drop
```