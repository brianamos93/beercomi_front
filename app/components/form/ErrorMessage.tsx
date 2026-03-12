import { FieldErrors, FieldValues, Path } from "react-hook-form";

type Props<T extends FieldValues> = {
  errors: FieldErrors<T>;
  name: Path<T>;
};

export default function ErrorMessage<T extends FieldValues>({
  errors,
  name,
}: Props<T>) {
  const error = errors[name];

  if (!error || !("message" in error)) return null;

  return (
    <p className="text-red-600 text-sm mt-2">
      {error.message as string}
    </p>
  );
}