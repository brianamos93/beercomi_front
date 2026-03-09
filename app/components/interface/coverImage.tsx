import Image from "next/image";

export default function CoverImage({
	cover_image,
	name,
}: {
	cover_image: string | undefined;
	name: string;
}) {
	const coverImage = cover_image ? `${cover_image}` : "/file.svg";

	return (
		<Image
			src={coverImage}
			fill
			alt={name || "Image"}
			className="object-cover rounded-t-lg"
			sizes="(max-width: 768px) 100vw, 33vw"
			priority={false}
			loading="lazy"
		/>
	);
}
