import { FieldErrors, Control } from "react-hook-form";
import TextField from "../form/TextField";
import { BreweryBaseFields } from "./BreweryFormType";

interface BeerCommonFieldsProps {
	errors: FieldErrors<BreweryBaseFields>;
	control: Control<BreweryBaseFields>;
}

export default function BreweryCommonFields({ errors, control }: BeerCommonFieldsProps) {
	return (
		<>
			<TextField<BreweryBaseFields> name="name" label="醸造所名：" control={control} errors={errors} />
			<TextField<BreweryBaseFields> name="location" label="住所：" control={control} errors={errors} />
			<TextField<BreweryBaseFields> name="date_of_founding" label="創立年：" control={control} errors={errors} />
		</>
	);
}
