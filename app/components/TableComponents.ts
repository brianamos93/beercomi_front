import { ComponentType } from "react";

import BeerCard from "./beer/BeerCard";
import BreweryCard from "./brewery/BreweryCard";
import ReviewCard from "./beer/review/ReveiwCard";
import DefaultCard from "./DefaultCard";

import { Beer, Brewery, Review } from "@/app/utils/def";

type TableEntry =
  | (Beer & { table_name: "beers" })
  | (Brewery & { table_name: "breweries" })
  | (Review & { table_name: "beer_reviews" });

type TableComponent = ComponentType<{ entry: TableEntry }>;

const TableComponents: Record<string, TableComponent> = {
  beers: BeerCard as TableComponent,
  breweries: BreweryCard as TableComponent,
  beer_reviews: ReviewCard as TableComponent,
  default: DefaultCard as TableComponent,
};

export default TableComponents;