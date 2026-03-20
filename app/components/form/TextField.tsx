import {
  Control,
  Controller,
  FieldValues,
  Path,
  FieldErrors,
} from "react-hook-form";
import ErrorMessage from "./ErrorMessage";

type Props<T extends FieldValues> = {
  name: Path<T> | string;
  label: string;
  control?: Control<T>;
  errors?: FieldErrors<T>;
  type?: string;
  className?: string;

  // fallback (non-RHF)
  value?: string;
  onChange?: (value: string) => void;
};

export default function TextField<T extends FieldValues>({
  name,
  label,
  control,
  errors,
  type = "text",
  value,
  onChange,
  className = "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-amber-500",
}: Props<T>) {
  return (
    <div>
      <label className="block text-sm font-medium text-sky-800">
        {label}
      </label>

      {control ? (
        <Controller
          name={name as Path<T>}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type={type}
              className={className}
            />
          )}
        />
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={className}
        />
      )}

      {errors && <ErrorMessage name={name as Path<T>} errors={errors} />}
    </div>
  );
}