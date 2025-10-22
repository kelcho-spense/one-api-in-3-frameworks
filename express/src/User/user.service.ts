
import { User } from '../entity/User';
import { Repository } from 'typeorm';
import AppDataSource from '../data-source';
import { Profile } from '../entity/Profile';

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
		async updateUser(id: string, userData: Partial<User>, profileData?: Partial<Profile>): Promise<User | null> {
				const user = await this.userRepository.findOne({
						where: { id },
						relations: ['profile']
				});
				if (!user) {
						return null;
				}
				this.userRepository.merge(user, userData);
				if (profileData) {
						if (user.profile) {
								this.profileRepository.merge(user.profile, profileData);
						}
						else {
								const profile = this.profileRepository.create(profileData);
								profile.user = user;
								user.profile = profile;
						}	
				}
				return await this.userRepository.save(user);
		}

		async deleteUser(id: string): Promise<boolean> {
				const result = await this.userRepository.delete(id);
				return result.affected !== 0;
		}
}

export default UserService;