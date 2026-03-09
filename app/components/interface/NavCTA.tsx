import Header from "./Header";
import { User } from "@/app/utils/def";

export default async function NavCTA({ userData }: { userData: User | null }) {
  

  if (!userData) {
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
