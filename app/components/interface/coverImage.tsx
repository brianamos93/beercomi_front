import Image from 'next/image'

export default function CoverImage({cover_image, name}: {cover_image: string | undefined, name: string}) {
	const coverImage = cover_image
	? `${cover_image}`
    	: "/file.svg";
	return (
			<Image
			src={coverImage}
			width={200}
			height={200}
			alt={`${name}`}
			className="object-cover rounded-t-lg"
			/>
	)
}