import { getLoggedInUsersData } from "@/app/utils/requests/userRequests";
import Header from "./Header";
import { cookies } from "next/headers";

export default async function NavCTA() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    const user = {
      display_name: null,
      profile_img_url: null,
      isAuthenticated: false,
    };
    return <Header user={user} />;
  }

  const userData = await getLoggedInUsersData(token);

  if (!userData) {
    // token invalid or no user found
    const user = {
      display_name: null,
      profile_img_url: null,
      isAuthenticated: false,
    };
    return <Header user={user} />;
  }

  const user = {
    display_name: userData.display_name,
    profile_img_url: userData.profile_img_url,
    isAuthenticated: true,
  };

  return <Header user={user} />;
}
