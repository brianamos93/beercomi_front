import BeerCard from "./beer/BeerCard";
import StoreCard from "./store/StoreCard";
import BreweryCard from "./brewery/BreweryCard";
import ReviewCard from "./beer/review/ReveiwCard"
import DefaultCard from "./DefaultCard";

const TableComponents = {
  beers: BeerCard,
  stores: StoreCard,
  breweries: BreweryCard,
  beer_reviews: ReviewCard,
  default: DefaultCard, // Fallback component
};

export default TableComponents;