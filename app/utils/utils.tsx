import z from "zod";

const url = "http://localhost:3005"

export default url

export async function transformZodErrors(error: z.ZodError) {
	return error.issues.map((issue) => ({
		path: issue.path.join("."),
		message: issue.message,
	}));
}