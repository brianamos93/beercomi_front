const date = new Date()
const year = date.getFullYear()

export default function Footer() {
	return (
		<footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
			<p className="flex items-center">©{year}</p>
      </footer>
	)
}