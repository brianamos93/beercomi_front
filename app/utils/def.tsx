import { z } from "zod";

export interface Entry {
	id: string;
	name: string;
	table_name: string;
	date_updated: Date;
}

export interface Photo {
	id: string;
	photo_url: string;
	date_updated: string;
	position: number;
}

export interface Review {
	id: string;
	beer_id: string;
	review: string;
	rating: number;
	author_id: string;
	author_name: string;
	date_created: string;
	date_updated: string;
	brewery_name: string;
	beer_name: string;
	photos: [
		Photo
	];
}

export interface Beer {
	id: string;
	cover_image: string;
	name: string;
	brewery_id: string;
	brewery_name: string;
	description: string;
	style: string;
	ibu: number;
	abv: number;
	color: string;
	author: string;
	author_name: string;
	reviews: Review[];
	date_created: Date;
	date_updated: Date;
	avg_rating: number;
	review_count: number;
}

export interface Brewery {
	id: string;
	name: string;
	location: string;
	date_of_founding: string;
	cover_image: string;
	date_created: Date;
	date_updated: Date;
}

export interface Store {
	id: string;
	name: string;
	location: string;
	date_of_founding: string;
	date_created: Date;
	date_updated: Date;
	author: string;
	owner: string;
}

export interface User {
	id: string;
	display_name: string;
	email: string;
	password: string;
	profile_img_url: string;
}

export interface Favorite {
	id: string;
	name: string;
	target_id: string;
	date_created: Date;
	brewery_id: string;
	brewery_name: string;
	source_table: string;
}

export interface Pagination {
	total: number;
	limit: number;
	offset: number;
}

export interface SearchResult {
	id: string;
	name: string;
	description: string;
	type: string;
}

export interface ActivityLogData {
	id: string;
	user_id: string;
	display_name: string;
	action: string;
	entity_type: string;
	entity_id: string;
	metadata: string;
	created_at: string;
}

export interface ActivityLogResponse {
	pagination: Pagination;
	data: ActivityLogData[];
}

export const SignupFormSchema = z.object({
	display_name: z
		.string()
		.min(5, { message: "表示名は5文字以上で入力してください。" })
		.trim(),
	email: z.string().email({ message: "メールを入力してください。" }).trim(),
	password: z
		.string()
		.min(8, { message: "8文字以上で入力してください。" })
		.regex(/[a-zA-Z]/, { message: "英字を1文字以上含めてください。" })
		.regex(/[0-9]/, { message: "数字を1文字以上含めてください。" })
		.regex(/[^a-zA-Z0-9]/, {
			message: "記号を1文字以上含めてください。",
		})
		.trim(),
});

export type SignupFormState =
	| {
			errors?: {
				display_name?: string[];
				email?: string[];
				password?: string[];
			};
			message?: string;
	  }
	| undefined;


export type DeletedFilter = "true" | "false" | "all";
