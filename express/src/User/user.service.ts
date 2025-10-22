
import { User } from '../entity/User';
import { Repository } from 'typeorm';
import AppDataSource from '../data-source';

// using repository pattern: service to handle user-related DB operations
class UserService {
	private userRepository: Repository<User>;

	constructor() {
		this.userRepository = AppDataSource.getRepository(User);
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

	async createUser(userData: Partial<User>): Promise<User> {
		// Create user
		const user = this.userRepository.create(userData);
		return await this.userRepository.save(user);
	}

	async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
		const user = await this.userRepository.findOne({
			where: { id }
		});
		if (!user) {
			return null;
		}
		this.userRepository.merge(user, userData);
		return await this.userRepository.save(user);
	}

	async deleteUser(id: string): Promise<boolean> {
		const result = await this.userRepository.delete(id);
		return result.affected !== 0;
	}
}

export default UserService;