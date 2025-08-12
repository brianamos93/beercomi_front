import { Store } from "@/app/utils/def";
import Link from "next/link";


export default function StoreCard({ entry }: {entry: Store}) {
	return (
		<>
			<Link
			href={`/stores/${entry.id}`}
			>
				<div className="border p-4 rounded-lg shadow-md bg-yellow-50">
					<h2 className="text-lg font-semibold">{entry.name} 🍽️</h2>
					<p><strong>Location:</strong> {entry.location}</p>
					<p><strong>Date of Founding:</strong> {entry.date_of_founding}</p>
					<p><strong>Updated:</strong> {new Date(entry.date_updated).toLocaleString()}</p>
				</div>
			</Link>
		</>
	);
  }