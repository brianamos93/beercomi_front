import { logout } from "@/app/utils/requests/userRequests";

export default function LogoutButton() {
	return (
		<form action={logout}>
			<button
				type="submit"
				className="text-gray-700 hover:text-red-600"
			>
				Logout
			</button>
		</form>
	);
}
