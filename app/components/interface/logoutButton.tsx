import { logout } from "@/app/utils/requests/userRequests";

type logoutButtonProps = {
  onClick?: () => void;
};

export default function LogoutButton({onClick}: logoutButtonProps) {
	return (
		<form action={logout}>
			<button
				type="submit"
				className="text-gray-700 hover:text-red-600"
			>
				ログアウト
			</button>
		</form>
	);
}
