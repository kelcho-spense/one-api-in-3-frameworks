import { Profile } from '../entity/Profile';
import { Repository } from 'typeorm';
import AppDataSource from '../data-source';
import { User } from '../entity/User';

// using repository pattern: service to handle profile-related DB operations
class ProfileService {
    private profileRepository: Repository<Profile>;
    private userRepository: Repository<User>;

    constructor() {
        this.profileRepository = AppDataSource.getRepository(Profile);
        this.userRepository = AppDataSource.getRepository(User);
    }

    async findAll(): Promise<Profile[]> {
        return await this.profileRepository.find({
            relations: ['user']
        });
    }

    async findById(id: string): Promise<Profile | null> {
        return await this.profileRepository.findOne({
            where: { id },
            relations: ['user']
        });
    }

    async findByUserId(userId: string): Promise<Profile | null> {
        return await this.profileRepository.findOne({
            where: { user: { id: userId } },
            relations: ['user']
        });
    }

    async createProfile(profileData: Partial<Profile>, userId: string): Promise<Profile> {
        // Check if user exists
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['profile']
        });

        if (!user) {
            throw new Error('User not found');
        }

        if (user.profile) {
            throw new Error('User already has a profile');
        }

        // Create profile and link to user
        const profile = this.profileRepository.create(profileData);
        profile.user = user;

        return await this.profileRepository.save(profile);
    }

    async updateProfile(id: string, profileData: Partial<Profile>): Promise<Profile | null> {
        const profile = await this.profileRepository.findOne({
            where: { id },
            relations: ['user']
        });

        if (!profile) {
            return null;
        }

        this.profileRepository.merge(profile, profileData);
        return await this.profileRepository.save(profile);
    }

    async deleteProfile(id: string): Promise<boolean> {
        const result = await this.profileRepository.delete(id);
        return result.affected !== 0;
    }
}

export default ProfileService;
