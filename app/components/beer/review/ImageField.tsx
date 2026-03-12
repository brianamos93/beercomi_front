import { FileItem } from "@/app/utils/schemas/reviewSchema";
import { useState } from "react";
import Image from "next/image";
import Dropzone from "react-dropzone";
import {
	Control,
	Controller,
	FieldErrors,
	FieldValues,
	Path,
} from "react-hook-form";
import { ZodType } from "zod";
import ErrorMessage from "../../form/ErrorMessage";

type Props<T extends FieldValues> = {
	name: Path<T>;
	label: string;
	control: Control<T>;
	errors: FieldErrors<T>;
	zodSchema: ZodType<File>;
	numberOfFiles: number;
};

export default function ImageField<T extends FieldValues>({
	name,
	label,
	control,
	errors,
	zodSchema,
	numberOfFiles,
}: Props<T>) {
	const error = errors[name];

	const [dropError, setDropError] = useState<string[]>([]);

	const errorMessages: Record<string, string> = {
		"file-too-large": "This file exceeds the 1 MB limit.",
		"file-invalid-type": "Only JPG, PNG, WEBP are allowed.",
	};

	return (
		<div className="space-y-2">
			<label className="mb-1 font-medium" htmlFor={name}>
				{label}
			</label>
			<Controller
				name={name}
				control={control}
				render={({ field: { onChange, value } }) => (
					<div>
						<Dropzone
							accept={{ "image/*": [] }}
							maxSize={1 * 1024 * 1024}
							maxFiles={numberOfFiles}
							onDrop={(acceptedFiles, rejectedFiles) => {
								setDropError([]);

								// Dropzone errors
								if (rejectedFiles.length > 0) {
									const customErrors = rejectedFiles.flatMap((r) =>
										r.errors.map((e) => errorMessages[e.code] || e.message),
									);
									setDropError(customErrors);
									return;
								}

								// Zod validation
								const zodErrors: string[] = [];
								acceptedFiles.forEach((file) => {
									const result = zodSchema.safeParse(file);
									if (!result.success) {
										zodErrors.push(
											...result.error.errors.map((err) => err.message),
										);
									}
								});

								if (zodErrors.length > 0) {
									setDropError(zodErrors);
									return;
								}

								// Append new files
								const newItems: FileItem[] = acceptedFiles.map((f) => ({
									file: f,
									preview: URL.createObjectURL(f),
									type: "new",
								}));
								onChange([...(value || []), ...newItems]);
							}}
						>
							{({ getRootProps, getInputProps }) => (
								<div
									{...getRootProps()}
									className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-yellow-400 hover:bg-yellow-50 transition"
								>
									<input {...getInputProps()} />
									<p className="text-gray-600 text-sm">
										Drag & drop file{numberOfFiles > 1 ? "s" : ""} here, or
										click to select
									</p>
								</div>
							)}
						</Dropzone>

						{/* Preview */}
						{value && value.length > 0 && (
							<ul className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
								{value.map((file: FileItem, idx: number) =>
									!(file.type === "existing" && file.markedForDelete) ? (
										<li key={idx} className="relative group border rounded p-1">
											<Image
												src={file.type === "existing" ? file.url : file.preview}
												alt="uploaded"
												width={150}
												height={150}
												className="object-scale-down w-full h-32 rounded"
											/>
											<button
												type="button"
												className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-80 hover:opacity-100"
												onClick={() => {
													let updated: FileItem[];
													if (file.type === "existing") {
														updated = value.map((f: FileItem, j: number) =>
															j === idx && f.type === "existing"
																? { ...f, markedForDelete: true }
																: f,
														);
													} else {
														updated = value.filter(
															(_: FileItem, j: number) => j !== idx,
														);
													}
													onChange([...updated]);
												}}
											>
												✕
											</button>
										</li>
									) : null,
								)}
							</ul>
						)}

						{/* File errors */}
						{dropError.length > 0 && (
							<ul className="text-red-500 mt-2">
								{dropError.map((err, idx) => (
									<li key={idx}>{err}</li>
								))}
							</ul>
						)}
					</div>
				)}
			/>
			<ErrorMessage name={name} errors={errors} />
		</div>
	);
}
