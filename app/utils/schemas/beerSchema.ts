import { z } from "zod"

const MAX_FILE_SIZE = 1000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

export const newCoverImageSchema = z
	.instanceof(File)
	.refine((f) => f.size <= MAX_FILE_SIZE, "最大サイズ：1MB")
	.refine(
		(f) => ACCEPTED_IMAGE_TYPES.includes(f.type),
		"Only JPG, JPEG, PNG, WEBP are allowed."
	).nullable().optional()

const existingCoverImageSchema = z.object({
	url: z.string(),
	type: z.literal("existing"),
})

const newEditCoverImageSchema = z.object({
	file: newCoverImageSchema,
	preview: z.string(),
	type: z.literal("new")

})

const beerBase = z.object({
	name: z
		.string()
		.trim()
		.min(1, "ビール名をを入力してください。"),
	style: z
		.string()
		.trim()
		.min(1, "スタイルをを入力してください。"),
	abv: z.coerce.number().min(0, "ABVは0より大きい数を入力してください。"),
	brewery_id: z.object({
		value: z.string(),
		label: z.string()
	}),
	color: z
		.string()
		.min(1, "色を入力してください。"),
	ibu: z.coerce.number().min(0, "IBUは0より大きい数を入力してください。"),
	description: z
		.string()
		.min(1, "説明文を入力してください。")
})


export const CreateBeerSchema = beerBase.extend({
	cover_image: newCoverImageSchema	
})

export type BeerFormValues = z.infer<typeof CreateBeerSchema>;

export const EditBeerSchema = beerBase.extend({
	cover_image: z.union([
		existingCoverImageSchema,
		newEditCoverImageSchema,
		z.null()
	]).optional(),
	deleteCoverImage: z.boolean(),
})

export type EditBeerInput = z.infer<typeof EditBeerSchema>;
