import { z } from "zod";

export interface Entry {
	id: string;
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

export const SignupFormSchema = z.object({
	display_name: z
		.string()
		.min(5, { message: "Display Name must be at least 5 characters long." })
		.trim(),
	email: z.string().email({ message: "Please enter a valid email." }).trim(),
	password: z
		.string()
		.min(8, { message: "Be at least 8 characters long" })
		.regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
		.regex(/[0-9]/, { message: "Contain at least one number." })
		.regex(/[^a-zA-Z0-9]/, {
			message: "Contain at least one special character.",
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
