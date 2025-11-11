"use server";

import { cookies } from "next/headers";
import {
	createBrewery,
	updateBrewery,
} from "../utils/requests/breweryRequests";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createServerBrewery(formData: FormData) {
	const token = (await cookies()).get("token")?.value;

	if (!token) {
		return { error: "Not Logged In", status: 401 };
	}

	let res;

	try {
		res = await createBrewery(formData, token);
	} catch (error) {
		console.log("Server action error:", error);
		return {
			error: "Unexpected server error",
			status: 500,
		};
	}

	if (res.errors) {
		return {
			error: res.errors,
			status: res.status ?? 400,
		};
	}
	if (res.id) {
		revalidatePath("/breweries");
		redirect(`/breweries/${res.id}`);
	}
	return { error: "Unexpected API response", status: 500 };
}

export async function updateServerBrewery(id: string, formData: FormData) {
	const token = (await cookies()).get("token")?.value;

	if (!token) {
		return { error: "Not Logged In", status: 401 };
	}
	let res;

	try {
		res = await updateBrewery(id, formData, token);
	} catch (error) {
		console.error("Server action error:", error);
		return {
			error: "Unexpected server error",
			status: 500,
		};
	}
	console.log(res)
	if (res.error) {
		return {
			error: res.error,
			status: res.status ?? 400,
		};
	}
	if (res.id) {
		revalidatePath("/breweries");
		redirect("/breweries");
	}

	return {
		error: "Unexpected API response",
		status: 500,
	};
}
