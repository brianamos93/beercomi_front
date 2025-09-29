import { z } from "zod";

const MAX_FILE_SIZE = 1000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

export const createNewfileSchema = z
  .instanceof(File)
  .refine((f) => f.size <= MAX_FILE_SIZE, "Max file size is 1MB")
  .refine(
    (f) => ACCEPTED_IMAGE_TYPES.includes(f.type),
    "Only JPG, PNG, WEBP are allowed")

const existingFileSchemaForEdit = z.object({
  id: z.string(),
  url: z.string().url(),
  type: z.literal("existing"),
  markedForDelete: z.boolean().optional(),
});

const newFileSchemaForEdit = z.object({
  file: createNewfileSchema,
  preview: z.string(),
  type: z.literal("new"),
});


export const CreateReviewSchema = z.object({
  review: z
    .string()
    .trim()
    .min(10, { message: "Review must be at least 10 character long." }),
  rating: z.coerce.number(),
  beer_id: z.string(),
  photos: z.array(createNewfileSchema).max(4, "You can upload up to 4 files.")
});

export const EditReviewSchema = z.object({
  review: z
    .string()
    .trim()
    .min(10, { message: "Review must be at least 10 character long." }),
  rating: z.coerce.number(),
  beer_id: z.string(),
  photos: z.array(z.union([newFileSchemaForEdit, existingFileSchemaForEdit])).max(4, "You can upload up to 4 files.")
});


export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;

export type EditReviewInput = z.infer<typeof EditReviewSchema>;

export type ExistingFile = z.infer<typeof existingFileSchemaForEdit>;
export type NewFile = z.infer<typeof newFileSchemaForEdit>;
export type FileItem = ExistingFile | NewFile;