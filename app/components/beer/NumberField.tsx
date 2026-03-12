import { FieldErrors, UseFormRegister } from "react-hook-form";

type Props = {
  name: string;
  label: string;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  step?: string;
};

export default function NumberField({
  name,
  label,
  register,
  errors,
  step = "1",
}: Props) {
  const error = errors[name];

  return (
    <div>
      <label className="block text-sm font-medium text-sky-800">
        {label}
      </label>

      <input
        type="number"
        step={step}
        {...register(name, { valueAsNumber: true })}
        className="mt-1 w-full rounded-md border px-3 py-2"
      />

      {error && (
        <p className="text-red-600 text-sm mt-2">
          {error.message as string}
        </p>
      )}
    </div>
  );
}