import {
	FieldErrors,
	FieldValues,
	Path,
	UseFormRegister,
	UseFormWatch,
} from "react-hook-form";
import ErrorMessage from "./ErrorMessage";

type Props<T extends FieldValues> = {
	name: Path<T>;
	label: string;
	register: UseFormRegister<T>;
	errors: FieldErrors<T>;
	watch: UseFormWatch<T>;
};

export default function RatingField<T extends FieldValues>({
	name,
	label,
	register,
	errors,
	watch,
}: Props<T>) {
	const error = errors[name];
	const selectedRating = Number(watch(name));

	return (
		<div className="space-y-2">
			<label htmlFor={name} className="mb-1 font-medium">
				{label}
			</label>

			<fieldset className="flex flex-row-reverse justify-center gap-1">
				{[5, 4, 3, 2, 1].map((star) => (
					<div key={star}>
						<input
							type="radio"
							id={`star${star}`}
							value={String(star)}
							className="peer hidden"
							{...register(name)}
						/>
						<label
							htmlFor={`star${star}`}
							className={`cursor-pointer text-2xl 
          ${selectedRating >= star ? "text-yellow-400" : "text-gray-300"} 
          hover:text-yellow-300`}
						>
							★
						</label>
					</div>
				))}
			</fieldset>

			<ErrorMessage name={name} errors={errors} />
		</div>
	);
}
