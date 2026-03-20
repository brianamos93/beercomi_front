"use client";

import { useState } from "react";
import Dropzone from "react-dropzone";
import Image from "next/image";
import { newCoverImageSchema } from "@/app/utils/schemas/beerSchema";

interface CoverImageFieldProps {
	onChange: (file: File | null) => void;
	onRemove: () => void;
	previewUrl: string | null;
	errorMessage?: string;
}

export default function CoverImageField({
	onChange,
	onRemove,
	previewUrl,
	errorMessage,
}: CoverImageFieldProps) {
	const [dropError, setDropError] = useState<string[]>([]);

	const errorMessages: Record<string, string> = {
		"file-too-large": "This file exceeds the 1 MB limit.",
		"file-invalid-type": "Only image files are allowed.",
	};

	return (
		<div>
			<label className="block text-sm font-medium text-black-800 mb-2">
				Cover Image
			</label>

			<Dropzone
				accept={{ "image/*": [] }}
				maxSize={1 * 1024 * 1024}
				maxFiles={1}
				onDrop={(acceptedFiles, rejectedFiles) => {
					setDropError([]);

					if (rejectedFiles.length > 0) {
						const customErrors = rejectedFiles.flatMap((r) =>
							r.errors.map((e) => errorMessages[e.code] || e.message),
						);
						setDropError(customErrors);
						return;
					}

					const zodErrors: string[] = [];

					if (acceptedFiles[0]) {
						const result = newCoverImageSchema.safeParse(acceptedFiles[0]);
						if (!result.success) {
							zodErrors.push(...result.error.errors.map((err) => err.message));
						}
					}

					if (zodErrors.length > 0) {
						setDropError(zodErrors);
						return;
					}

					if (acceptedFiles[0]) {
						onChange(acceptedFiles[0]);
					} else {
						onChange(null);
					}
				}}
			>
				{({ getRootProps, getInputProps }) => (
					<div
						{...getRootProps()}
						className="p-6 border-2 border-dashed border-amber-400 rounded-lg text-center cursor-pointer bg-amber-50 hover:bg-amber-100 transition"
					>
						<input {...getInputProps()} aria-label="Upload cover image" />
						<p className="text-sm text-gray-700">
							Drag & drop an image or tap to select
						</p>
						<p className="text-xs text-gray-500 mt-1">Max size 1MB</p>
					</div>
				)}
			</Dropzone>

			{previewUrl && (
				<div className="mt-3 relative w-fit">
					<Image
						src={previewUrl}
						alt="Cover Image Preview"
						width={150}
						height={150}
						className="rounded-lg object-cover border"
						onLoad={(e) => {
							if (previewUrl?.startsWith("blob:")) {
								URL.revokeObjectURL((e.target as HTMLImageElement).src);
							}
						}}
					/>

					<button
						type="button"
						onClick={onRemove}
						className="absolute top-1 right-1 bg-yellow-400 hover:bg-yellow-500 text-black rounded-full w-7 h-7 flex items-center justify-center"
						aria-label="Remove image"
					>
						✕
					</button>
				</div>
			)}

			{dropError.length > 0 && (
				<ul className="text-red-600 text-sm mt-2">
					{dropError.map((err, idx) => (
						<li key={idx}>{err}</li>
					))}
				</ul>
			)}

			{errorMessage && (
				<p className="text-red-600 text-sm mt-2">{errorMessage}</p>
			)}
		</div>
	);
}
