import { User } from "@/app/utils/def";
import Image from "next/image";

const AuthorImage = (props: User) => {
	const pictureurl = props.profile_img_url ? `http://localhost:3005/uploads/${props.profile_img_url}` : "/default.png";
	const altText = props.profile_img_url ? `${props.display_name}'s avatar` : "Default Avatar";
	return(
		<Image
		src={pictureurl}
		alt={altText}
		height={200}
		width={200}
		/>
	)
}

export default AuthorImage