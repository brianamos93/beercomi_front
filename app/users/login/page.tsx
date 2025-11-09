"use client";
import { useActionState } from "react";
import { Login } from "../../utils/requests/userRequests";
import { redirect } from "next/navigation";
import { useFormStatus } from "react-dom";

const initialState = { error: {}, success: undefined };

export default function LoginForm() {
  const [state, formAction] = useActionState(Login, initialState);

  if (state?.success) {
    redirect("/");
  }

  return (
    <form action={formAction} className="flex flex-col w-80 mx-auto mt-10 gap-2">
      <input name="email" type="email" placeholder="Email" className="border p-2 rounded" />
      {state?.error?.email && <p className="text-red-500">{state.error.email}</p>}

      <input name="password" type="password" placeholder="Password" className="border p-2 rounded" />
      {state?.error?.password && <p className="text-red-500">{state.error.password}</p>}

      {state?.error?.general && <p className="text-red-500">{state.error.general}</p>}

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="bg-blue-500 text-white p-2 rounded">
      {pending ? "Logging in..." : "Login"}
    </button>
  );
}
