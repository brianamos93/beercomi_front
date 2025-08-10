import { Review } from "@/app/utils/def";

export default function ReviewCard({ entry }: { entry: Review}) {
	return (
	  <div className="border p-4 rounded-lg shadow-md bg-yellow-50">
				<h2 className="text-lg font-semibold">
					{entry.brewery_name}&apos;s {entry.beer_name} Review
				</h2>
        		<p><strong>Author:</strong> {entry.author_display_name}</p>
        		<p><strong>Rating:</strong> {entry.rating}</p>
        		<p><strong>Updated:</strong> {new Date(entry.date_updated).toLocaleString()}</p>
  </div>
	);
  }