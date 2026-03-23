import { cookies } from "next/headers";
import { checkFavorite } from "@/app/utils/requests/favoriteRequests";
import BeerEditLink from "./BeerEditLink";
import ToggleFavoriteButton from "@/app/components/interface/buttons/FavoriteToggleClient";

export default async function BeerDynamicSection({
  beerId,
  authorId,
}: {
  beerId: string;
  authorId: string;
}) {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  const favoriteRes = await checkFavorite(beerId, "beers", token);
  const favorited = Boolean(favoriteRes.favorited);
  const favorite_id = favoriteRes.favorited ? favoriteRes.favorite_id : undefined;

  return (
    <div className="flex items-center gap-4">
      <BeerEditLink author_id={authorId} beer_id={beerId} />
      <ToggleFavoriteButton
        type="beers"
        id={beerId}
        initialFavorite={favorited}
        favorite_id={favorite_id}
      />
    </div>
  );
}