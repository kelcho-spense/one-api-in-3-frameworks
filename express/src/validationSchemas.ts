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

// Author validation schemas
export const createAuthorSchema = z.object({
  userId: z.string().regex(sqlServerUuidRegex, 'Invalid user ID format'),
  biography: z.string().optional(),
});

export const updateAuthorSchema = z.object({
  biography: z.string().optional(),
});

// Blog validation schemas
export const createBlogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
  content: z.string().min(1, 'Content is required'),
  slug: z.string().max(150, 'Slug cannot exceed 150 characters').optional(),
  published: z.boolean().optional(),
  excerpt: z.string().optional(),
  authorId: z.string().regex(sqlServerUuidRegex, 'Invalid author ID format'),
  categoryIds: z.array(z.string().regex(sqlServerUuidRegex, 'Invalid category ID format')).optional(),
});

export const updateBlogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  slug: z.string().max(150, 'Slug cannot exceed 150 characters').optional(),
  published: z.boolean().optional(),
  excerpt: z.string().optional(),
  authorId: z.string().regex(sqlServerUuidRegex, 'Invalid author ID format').optional(),
  categoryIds: z.array(z.string().regex(sqlServerUuidRegex, 'Invalid category ID format')).optional(),
});

// Comment validation schemas
export const createCommentSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  userId: z.string().regex(sqlServerUuidRegex, 'Invalid user ID format'),
  blogId: z.string().regex(sqlServerUuidRegex, 'Invalid blog ID format'),
  isApproved: z.boolean().optional(),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1, 'Content is required').optional(),
  isApproved: z.boolean().optional(),
});

// Category validation schemas
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters'),
  slug: z.string().min(1, 'Slug is required').max(150, 'Slug cannot exceed 150 characters'),
  description: z.string().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters').optional(),
  slug: z.string().min(1, 'Slug is required').max(150, 'Slug cannot exceed 150 characters').optional(),
  description: z.string().optional(),
});

