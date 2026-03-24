import { UseFormRegister, FieldErrors, Control } from "react-hook-form";
import TextField from "../form/TextField";
import NumberField from "../form/NumberField";
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
			<TextField<BeerBaseFields> name="name" label="ビール名" control={control} errors={errors} />
			<TextField<BeerBaseFields> name="style" label="スタイル" control={control} errors={errors} />
			<NumberField<BeerBaseFields> name="abv" label="ABV (%)" step="0.1" register={register} errors={errors} />
			<BrewerySelectField control={control} errors={errors} />
			<TextField<BeerBaseFields> name="description" label="説明文" control={control} errors={errors} />
			<NumberField<BeerBaseFields> name="ibu" label="IBU" step="1" register={register} errors={errors} />
			<TextField<BeerBaseFields> name="color" label="色" control={control} errors={errors} />
		</>
	);
}
