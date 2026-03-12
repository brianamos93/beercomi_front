import { FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  type?: string;
};

export default function TextField<T extends FieldValues>({
  name,
  label,
  register,
  errors,
  type = "text",
}: Props<T>) {
  const error = errors[name];

  return (
    <div>
      <label className="block text-sm font-medium text-sky-800">
        {label}
      </label>

      <input
        type={type}
        {...register(name)}
        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-sky-500"
      />

      {error && (
        <p className="text-red-600 text-sm mt-2">
          {error.message as string}
        </p>
      )}
    </div>
  );
}