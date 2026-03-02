"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createBeer, updateBeer } from "../utils//requests/beerRequests";
import { redirect } from "next/navigation";

export async function createServerBeer(formData: FormData) {
	const token = (await cookies()).get("token")?.value;

	if (!token) {
		return { error: "Not Logged In", status: 401 };
	}

	let res;

	try {
		res = await createBeer(formData, token);
	} catch (error: unknown) {
		console.error("Server action error:", error);
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
	if (res.id) {
		revalidatePath("/beers");
		redirect(`/beers/${res.id}`);
	}
	return { error: "Unexpected API response", status: 500 };
}

export async function updateServerBeer(id: string, formData: FormData) {
	const token = (await cookies()).get("token")?.value;

	if (!token) {
		return { error: "Not Logged In", status: 401 };
	}
	let res;

	try {
		res = await updateBeer(id, formData, token);
	} catch (error) {
		console.error("Server action error:", error);
		return {
			error: "Unexpected server error",
			status: 500,
		};
	}
	console.log("Beer update response:", JSON.stringify(res, null, 2));
	
	// Handle validation errors (array of error objects from express-zod-safe)
	if (Array.isArray(res)) {
		console.log("Validation errors detected:", res);
		const errorMessages = res
			.flatMap((err: { type: string; errors: Array<{ path?: string; message: string }> }) => {
				console.log(`${err.type} validation errors:`, err.errors);
				return err.errors.map((e: { path?: string; message: string }) => 
					e.path ? `${e.path}: ${e.message}` : e.message
				);
			})
			.join(", ");
		console.log("Final error message:", errorMessages);
		return {
			error: errorMessages || "Validation failed",
			status: 400,
		};
	}

	if (res.error) {
		console.log("API error:", res.error);
		return {
			error: res.error,
			status: res.status ?? 400,
		};
	}

	if (res.message) {
		console.log("Success:", res.message);
		revalidatePath(`/beers/${id}`);
		redirect(`/beers/${id}`);
	}
	return {
		error: "Unexpected API response",
		status: 500,
	};
}
