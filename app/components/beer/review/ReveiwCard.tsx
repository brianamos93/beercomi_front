import { Beer, Review } from "@/app/utils/def";
import { getBeer } from "@/app/utils/requests/beerRequests";
import { useEffect, useState } from "react";


export default function ReviewCard({ entry }: { entry: Review}) {
	const [beer, setBeer] = useState<Beer>()

	useEffect(() => {
		async function fetchData() {
			const res = await getBeer(entry.beer_id)
			setBeer(res)
		}
		fetchData()
	}, [entry.beer_id])
	return (
	  <div className="border p-4 rounded-lg shadow-md bg-yellow-50">
    	{beer ? (
			<>
				<h2 className="text-lg font-semibold">
					{beer.brewery_name}&apos;s {beer.name} Review
				</h2>
        		<p><strong>Author:</strong> {entry.author_display_name}</p>
        		<p><strong>Rating:</strong> {entry.rating}</p>
        		<p><strong>Updated:</strong> {new Date(entry.date_updated).toLocaleString()}</p>
      		</>
    ) : (
      <p>Loading...</p>
    )}
  </div>
	);
  }