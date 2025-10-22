import * as z from "zod";

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// SQL Server UUID regex pattern : 8-4-4-4-5 hexadecimal characters
// normal uuid regex: 8-4-4-4-12 hexadecimal characters thus we need to adjust the third segment to allow 4 or 5 characters
const sqlServerUuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4,5}-[0-9A-F]{4}-[0-9A-F]{12}$/i;

export const uuidParamSchema = z.object({
  id: z.string()
    .regex(sqlServerUuidRegex, 'Invalid UUID format')
});

export const userIdParamSchema = z.object({
  userId: z.string()
    .regex(sqlServerUuidRegex, 'Invalid UUID format')
});

export const updateUserSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

// Profile validation schemas
export const createProfileSchema = z.object({
  userId: z.string().regex(sqlServerUuidRegex, 'Invalid user ID format'),
  fullName: z.string().max(100, 'Full name cannot exceed 100 characters').optional(),
  bio: z.string().max(1000, 'Bio cannot exceed 1000 characters').optional(),
  avatarUrl: z.url('Invalid URL format').optional(),
});

export const updateProfileSchema = z.object({
  fullName: z.string().max(100, 'Full name cannot exceed 100 characters').optional(),
  bio: z.string().max(1000, 'Bio cannot exceed 1000 characters').optional(),
  avatarUrl: z.url('Invalid URL format').optional(),
});

