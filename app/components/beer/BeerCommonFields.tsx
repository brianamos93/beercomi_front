import { UseFormRegister, FieldErrors, Control } from "react-hook-form";
import TextField from "./TextField";
import NumberField from "./NumberField";
import BrewerySelectField from "./BrewerySelectField";

interface BeerCommonFieldsProps {
	register: UseFormRegister<any>;
	errors: FieldErrors<any>;
	control: Control<any>;
}

export default function BeerCommonFields({ register, errors, control }: BeerCommonFieldsProps) {
	return (
		<>
			<TextField name="name" label="Name" register={register} errors={errors} />
			<TextField name="style" label="Style" register={register} errors={errors} />
			<NumberField name="abv" label="ABV (%)" step="0.1" register={register} errors={errors} />
			<BrewerySelectField control={control} errors={errors} />
			<TextField name="description" label="Description" register={register} errors={errors} />
			<NumberField name="ibu" label="IBU" step="1" register={register} errors={errors} />
			<TextField name="color" label="Color" register={register} errors={errors} />
		</>
	);
}
