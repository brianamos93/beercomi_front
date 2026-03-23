import z from "zod";

const url = process.env.NEXT_PUBLIC_BACKEND_URL

export default url

export async function transformZodErrors(error: z.ZodError) {
	return error.issues.map((issue) => ({
		path: issue.path.join("."),
		message: issue.message,
	}));
}