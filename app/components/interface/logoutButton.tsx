import { logout } from "@/app/utils/requests/userRequests";

export default function LogoutButton() {
	return (
		    <form action={logout}>
                <button type="submit">Logout</button>
            </form>
	)
}