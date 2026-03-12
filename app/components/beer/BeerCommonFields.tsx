import { UseFormRegister, FieldErrors, Control } from "react-hook-form";
import TextField from "./TextField";
import NumberField from "./NumberField";
import BrewerySelectField from "./BrewerySelectField";
import { BeerBaseFields } from "./BeerFormType";

interface BeerCommonFieldsProps {
	register: UseFormRegister<BeerBaseFields>;
	errors: FieldErrors<BeerBaseFields>;
	control: Control<BeerBaseFields>;
}

export default function BeerCommonFields({ register, errors, control }: BeerCommonFieldsProps) {
	return (
		<>
			<TextField<BeerBaseFields> name="name" label="Name" register={register} errors={errors} />
			<TextField<BeerBaseFields> name="style" label="Style" register={register} errors={errors} />
			<NumberField<BeerBaseFields> name="abv" label="ABV (%)" step="0.1" register={register} errors={errors} />
			<BrewerySelectField control={control} errors={errors} />
			<TextField<BeerBaseFields> name="description" label="Description" register={register} errors={errors} />
			<NumberField<BeerBaseFields> name="ibu" label="IBU" step="1" register={register} errors={errors} />
			<TextField<BeerBaseFields> name="color" label="Color" register={register} errors={errors} />
		</>
	);
}
