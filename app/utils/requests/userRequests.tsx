"use server";
import z from "zod";
import url from "../utils";
import { cookies } from "next/headers";

const LoginSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginState =
  | { success: true; error?: undefined }
  | { success?: undefined; error: { email?: string[]; password?: string[]; general?: string[] } };

export async function Login(
  prevState: LoginState, 
  formData: FormData
): Promise<LoginState> {

  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return { error: errors };
  }

  const { email, password } = parsed.data;

  const res = await fetch(url + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (res.status === 200) {
    const body = await res.json();
    const token = body.token;
    const userData = body.userForToken;
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    const cookieStore = await cookies();
    cookieStore.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      expires,
    });

    cookieStore.set({
      name: "userData",
      value: JSON.stringify(userData),
      httpOnly: true,
      path: "/",
      expires,
    });

    return { success: true };
  }

  if (res.status === 401) {
    return { error: { general: ["Incorrect email or password"] } };
  }

  return { error: { general: ["Unexpected server error"] } };
}

export const getOneUser = async (id: string) => {
	const res = await fetch(`${url}/user/${id}`);
	return res.json();
};

export async function logout() {
	// Destroy the session
	(
		await // Destroy the session
		cookies()
	).set("token", "", { expires: new Date(0) });

	(
		await // Destroy the session
		cookies()
	).set("userData", "", { expires: new Date(0) });
}

export const getRecentActivityOneUser = async (userId: string) => {
	const res = await fetch(url + `/user/${userId}/recentactivity`);
	return res.json();
};

export const getLoggedInUsersData = async () => {
  const token = (await cookies()).get("token")?.value;

  if (!token) return null;

  const res = await fetch(url + "/user", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
};

export const getUserFavorites = async (user_id: string, limit: number, offset: number) => {
	const res = await fetch(`${url}/favorites/all/user/${user_id}?=limit=${limit}&offset=${offset}`, {
		method: "GET",
	})
	return res.json()
}