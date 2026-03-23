import Link from "next/link";
import { cookies } from "next/headers";
import { getLoggedInUsersData } from "@/app/utils/requests/userRequests";
import { checkFavorite } from "@/app/utils/requests/favoriteRequests";
import ToggleFavoriteButton from "@/app/components/interface/buttons/FavoriteToggleClient";

export default async function BreweryDynamicSection({
    breweryId,
    authorId,
}: {
    breweryId: string;
    authorId: string;
}) {
    const token = (await cookies()).get("token")?.value;
    if (!token) return null;

    const [userData, favoriteRes] = await Promise.all([
        getLoggedInUsersData(),
        checkFavorite(breweryId, "breweries", token),
    ]);

    const favorited = Boolean(favoriteRes.favorited);
    const favorite_id = favoriteRes.favorited ? favoriteRes.favorite_id : undefined;

    return (
        <div className="flex items-center gap-4">
            {authorId === userData.id && (
                <Link
                    href={`/breweries/${breweryId}/edit`}
                    className="text-sm font-semibold text-yellow-600 hover:underline"
                >
                    Edit Brewery
                </Link>
            )}
            <ToggleFavoriteButton
                type="breweries"
                id={breweryId}
                initialFavorite={favorited}
                favorite_id={favorite_id}
            />
        </div>
    );
}