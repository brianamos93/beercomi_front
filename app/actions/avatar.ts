"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { uploadAvatar } from "../utils/requests/profileRequests";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const AvatarFormSchema = z.object({
  image: z.any(),
});

export type State = {
  avatar?: {
    file?: File | null;
  };
  errors?: {
    file?: string[];
  };
  message?: string | null;
};

export async function uploadAvatarServer(
  prevState: State,
  formData: FormData
): Promise<State> {
  const token = (await cookies()).get("token")?.value;

  const validatedFields = AvatarFormSchema.safeParse({
    image: formData.get("image"), // ✅ FIXED: matches input name
  });

  // ✅ Not logged in
  if (!token) {
    return {
      errors: {
        file: ["Not Logged In"],
      },
      message: "Not Logged In",
    };
  }

  // ✅ Validation failed
  if (!validatedFields.success) {
    return {
      avatar: {
        file: formData.get("image") as File | null, // ✅ correct type
      },
      errors: {
        file: validatedFields.error.flatten().fieldErrors.image ?? [],
      },
      message: "Failed to upload avatar",
    };
  }

  // ✅ Upload attempt
  try {
    await uploadAvatar(formData, token);
  } catch (error) {
    return {
      message: "Database Error: Failed to Upload Avatar.",
    };
  }

  // ✅ Success (no return needed because redirect ends execution)
  revalidatePath("/users/profile");
  redirect("/users/profile");
}