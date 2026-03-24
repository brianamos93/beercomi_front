import { z } from "zod";

const MAX_FILE_SIZE = 1000000;
const ACCEPTED_IMAGE_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
];

export const newCoverImageSchema = z
	.instanceof(File)
	.refine((f) => f.size <= MAX_FILE_SIZE, "最大サイズ：1MB")
	.refine(
		(f) => ACCEPTED_IMAGE_TYPES.includes(f.type),
		"Only JPG, JPEG, PNG, WEBP are allowed.",
	)
	.nullable()
	.optional();

const existingCoverImageSchema = z.object({
	url: z.string(),
	type: z.literal("existing"),
});

const newEditCoverImageSchema = z.object({
	file: newCoverImageSchema,
	preview: z.string(),
	type: z.literal("new"),
});

export const CreateBrewerySchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, { message: "ブルワリー名は1文字以上で入力してください。" })
		.trim(),
	location: z.string().trim().min(5, {
		message: "住所は1文字以上で入力してください。",
	}),
	date_of_founding: z.string().trim().min(4, {
		message: "創立年は4文字以上で入力してください。",
	}),
	cover_image: newCoverImageSchema,
});

export const EditBrewerySchema = CreateBrewerySchema.extend({
	cover_image: z
		.union([newEditCoverImageSchema, existingCoverImageSchema, z.null()])
		.optional(),
	deleteCoverImage: z.boolean(),
});

export type EditBreweryInput = z.infer<typeof EditBrewerySchema>;
