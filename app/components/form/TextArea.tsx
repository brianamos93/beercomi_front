import {
	FieldErrors,
	FieldValues,
	Path,
	UseFormRegister,
} from "react-hook-form";

type Props<T extends FieldValues> = {
	name: Path<T>;
	label: string;
	register: UseFormRegister<T>;
	errors: FieldErrors<T>;
};

export default function TextArea<T extends FieldValues>({
	name,
	label,
	register,
	errors,
}: Props<T>) {
	const error = errors[name];

	return (
		<div className="flex flex-col w-full">
			<label htmlFor={name} className="mb-1 font-medium">
				{label}
			</label>

			<textarea
				{...register(name)}
				id={name}
				rows={6}
				className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>

			{error && (
				<p className="mt-1 text-sm text-red-500">{error.message as string}</p>
			)}
		</div>
	);
}
