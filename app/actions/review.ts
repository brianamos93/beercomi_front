"use server";

import { cookies } from "next/headers";
import { createReview, editReview } from "../utils/requests/reviewRequests";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";

export async function transformZodErrors(error: z.ZodError) {
	return error.issues.map((issue) => ({
		path: issue.path.join("."),
		message: issue.message,
	}));
}

export async function createServerReview(formData: FormData) {
	const token = (await cookies()).get("token")?.value;
	const beerId = formData.get("beer_id");

	if (!token) {
		return { error: "Not Logged In", status: 401 };
	}
	let res;

	try {
		res = await createReview(formData, token);
	} catch (err: unknown) {
		console.error("Server action error:", err);
		return {
			error: "Unexpected server error",
			status: 500,
		};
	}
	if (res.error) {
		return {
			error: res.error,
			status: res.status ?? 400,
		};
	}
	if (res.message) {
		revalidatePath(`/beers/${beerId}`);
		redirect(`/beers/${beerId}`);
	}

	return { error: "Unexpected API response", status: 500 };
}

export async function editServerReview(id: string, formData: FormData) {
	const token = (await cookies()).get("token")?.value;
	const beerId = formData.get("beer_id");
	console.log(formData)
	if (!token) {
		return { error: "Not Logged In", status: 401 };
	}
	let res;

	try {
		res = await editReview(id, formData, token);
	} catch (err: unknown) {
		console.error("Server action error:", err);
		return {
			error: "Unexpected server error",
			status: 500,
		};
	}
	if (res.error) {
		return {
			error: res.error,
			status: res.status ?? 400,
		};
	}
	if (res.message) {
		revalidatePath(`/beers/${beerId}`);
		redirect(`/beers/${beerId}`);
	}
	return {
		error: "Unexpected API response",
		status: 500,
	};
}
