import Image from 'next/image'

export default function CoverImage({cover_image, name}: {cover_image: string, name: string}) {
	const coverImage = cover_image
	? `http://127.0.0.1:3005${cover_image}`
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