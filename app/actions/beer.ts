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
	const token = (await cookies()).get("session")?.value;

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
	if (res.error) {
		return {
			error: res.error,
			status: res.status ?? 400,
		};
	}

	if (res.id) {
		revalidatePath(`/beers/${res.id}`);
		redirect(`/beers/${res.id}`);
	}
	return {
		error: "Unexpected API response",
		status: 500,
	};
}
