import { Control, Controller, FieldErrors } from "react-hook-form";
import { AsyncPaginate, LoadOptions } from "react-select-async-paginate";
import { getBreweries } from "@/app/utils/requests/breweryRequests";
import { Brewery } from "@/app/utils/def";
import { GroupBase, OptionsOrGroups } from "react-select";
import { BeerBaseFields } from "./BeerFormType";

type BreweryOption = {
	value: string;
	label: string;
};

type Additional = {
	offset: number;
};

const loadOptions: LoadOptions<
	BreweryOption,
	GroupBase<BreweryOption>,
	Additional
> = async (
	search: string,
	loadedOptions: OptionsOrGroups<BreweryOption, GroupBase<BreweryOption>>,
	additional?: Additional,
) => {
	const offset = additional?.offset ?? 0;
	const res = await getBreweries({ limit: 20, offset: offset, q: search });

	return {
		options: res.data.map((brewery: Brewery) => ({
			value: brewery.id,
			label: brewery.name,
		})),
		hasMore:
			res.pagination.offset + res.pagination.limit < res.pagination.total,
		additional: {
			offset: res.pagination.offset + res.pagination.limit,
		},
	};
};

export default function BrewerySelectField({
  control,
  errors,
}: {
  control: Control<BeerBaseFields>;
  errors: FieldErrors<BeerBaseFields>;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-sky-800 mb-2">
        Brewery
      </label>

      <Controller
        name="brewery_id"
        control={control}
        render={({ field }) => (
          <AsyncPaginate
            {...field}
            loadOptions={loadOptions}
            additional={{ offset: 0 }}
            debounceTimeout={300}
            instanceId="brewery-select"
            isSearchable
            placeholder="Search breweries..."
          />
        )}
      />

      {errors.brewery_id && (
        <p className="text-red-600 text-sm mt-2">
          {errors.brewery_id.message as string}
        </p>
      )}
    </div>
  );
}