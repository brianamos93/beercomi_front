export default function DefaultCard({ entry }) {
	return (
	  <div className="border p-4 rounded-lg shadow-md bg-gray-50">
		<h2 className="text-lg font-semibold">{entry.name}</h2>
		<p><strong>Updated:</strong> {new Date(entry.date_updated).toLocaleString()}</p>
		<p>Unknown table: {entry.table_name}</p>
	  </div>
	);
  }