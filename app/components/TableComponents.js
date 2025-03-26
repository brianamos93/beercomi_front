import BeerCard from "./BeerCard";
import StoreCard from "./StoreCard";
import BreweryCard from "./BreweryCard";
import DefaultCard from "./DefaultCard";

const TableComponents = {
  beers: BeerCard,
  stores: StoreCard,
  breweries: BreweryCard,
  default: DefaultCard, // Fallback component
};

export default TableComponents;