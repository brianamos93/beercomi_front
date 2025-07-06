import BeerCard from "./beer/BeerCard";
import StoreCard from "./store/StoreCard";
import BreweryCard from "./brewery/BreweryCard";
import DefaultCard from "./DefaultCard";

const TableComponents = {
  beers: BeerCard,
  stores: StoreCard,
  breweries: BreweryCard,
  default: DefaultCard, // Fallback component
};

export default TableComponents;