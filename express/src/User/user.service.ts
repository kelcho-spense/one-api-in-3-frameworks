
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