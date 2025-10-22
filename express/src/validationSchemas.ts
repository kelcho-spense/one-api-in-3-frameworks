import * as z from "zod"; 

export const createUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required').max(20, 'Last name max length is 20'),
  email: z.email('Invalid email address'),
});

// SQL Server UUID regex pattern : 8-4-4-4-5 hexadecimal characters
// normal uuid regex: 8-4-4-4-12 hexadecimal characters thus we need to adjust the third segment to allow 4 or 5 characters
const sqlServerUuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4,5}-[0-9A-F]{4}-[0-9A-F]{12}$/i;

export const uuidParamSchema = z.object({
  id: z.string()
       .regex(sqlServerUuidRegex, 'Invalid ID format')
});
export const updateUserSchema = createUserSchema.partial();

// export type CreateUserInput = z.infer<typeof createUserSchema>;
// export type UpdateUserInput = z.infer<typeof updateUserSchema>;