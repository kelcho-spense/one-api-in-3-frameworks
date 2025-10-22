import { Router, Request, Response } from 'express';
import ProfileService from './profile.service';
import { createProfileSchema, updateProfileSchema, uuidParamSchema } from '../validationSchemas';
import { validate, validateParams } from '../middlewares';

const profileRouter: Router = Router();
const profileService = new ProfileService();

// Get all profiles
profileRouter.get('/profiles', async (req: Request, res: Response) => {
  try {
    const profiles = await profileService.findAll();
    res.status(200).json(profiles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profiles' });
  }
});

// Get profile by ID
profileRouter.get('/profiles/:id', validateParams(uuidParamSchema), async (req: Request, res: Response) => {
  const profileId = req.params.id!;

  try {
    const profile = await profileService.findById(profileId);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    return res.status(200).json(profile);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get profile by user ID
profileRouter.get('/users/:userId/profile', validateParams(uuidParamSchema), async (req: Request, res: Response) => {
  const userId = req.params.userId!;

  try {
    const profile = await profileService.findByUserId(userId);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found for this user' });
    }
    return res.status(200).json(profile);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Create a new profile for a user
profileRouter.post('/profiles', validate(createProfileSchema), async (req: Request, res: Response) => {
  try {
    const { userId, ...profileData } = req.body;
    const newProfile = await profileService.createProfile(profileData, userId);
    res.status(201).json(newProfile);
  } catch (err: any) {
    if (err?.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    if (err?.message === 'User already has a profile') {
      return res.status(409).json({ error: 'User already has a profile' });
    }
    res.status(500).json({ error: 'Failed to create profile' });
  }
});

// Update profile
profileRouter.put('/profiles/:id', validateParams(uuidParamSchema), validate(updateProfileSchema), async (req: Request, res: Response) => {
  const profileId = req.params.id!;

  try {
    const profileData = req.body;
    const updatedProfile = await profileService.updateProfile(profileId, profileData);
    if (!updatedProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    return res.status(200).json(updatedProfile);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Delete profile
profileRouter.delete('/profiles/:id', validateParams(uuidParamSchema), async (req: Request, res: Response) => {
  const profileId = req.params.id!;

  try {
    const deleted = await profileService.deleteProfile(profileId);
    if (!deleted) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    return res.status(204).end();
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete profile' });
  }
});

export default profileRouter;