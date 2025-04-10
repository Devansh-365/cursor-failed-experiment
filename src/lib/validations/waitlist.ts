import { z } from 'zod';

export const WaitlistSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email must be less than 100 characters'),
  name: z
    .string({ required_error: 'Name is required' })
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .optional(),
  referralCode: z
    .string()
    .optional(),
});

export type WaitlistFormData = z.infer<typeof WaitlistSchema>; 