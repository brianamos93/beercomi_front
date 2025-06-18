

export default function BeerCard({ entry }) {
	return (
	  <div className="border p-4 rounded-lg shadow-md bg-yellow-50">
		<h2 className="text-lg font-semibold">{entry.name} 🍺</h2>
		<p><strong>Style:</strong> {entry.style}</p>
		<p><strong>ABV:</strong> {entry.abv}%</p>
		<p><strong>Brewery:</strong> {entry.brewery}</p>
		<p><strong>Updated:</strong> {new Date(entry.date_updated).toLocaleString()}</p>
	  </div>
	);
  }