import { z } from "zod";

const MAX_FILE_SIZE = 1000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

export const fileSchema = z
  .instanceof(File)
  .refine((f) => f.size <= MAX_FILE_SIZE, "Max file size is 2MB")
  .refine(
    (f) => ACCEPTED_IMAGE_TYPES.includes(f.type),
    "Only JPG, PNG, WEBP are allowed")

export const ReviewSchema = z.object({
  review: z
    .string()
    .trim()
    .min(10, { message: "Review must be at least 10 character long." }),
  rating: z.coerce.number(),
  beer_id: z.string(),
  photos: z.array(fileSchema).max(4, "You can upload up to 4 files.")
});


export type ReviewInput = z.infer<typeof ReviewSchema>;
