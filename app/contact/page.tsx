export default async function ContactPage() {
	return (
		<div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
			<div className="bg-white shadow-md rounded-2xl p-8 max-w-md w-full">
				<h1 className="text-2xl font-bold text-center mb-6">Contact</h1>

				<div className="space-y-4 text-center">
					<div>
						<p className="text-gray-500 text-sm">Name</p>
						<p className="font-medium text-lg">Brian Amos</p>
					</div>

					<div>
						<p className="text-gray-500 text-sm">Email</p>
						<a
							href="mailto:your@email.com"
							className="text-blue-600 hover:underline"
						>
							your@email.com
						</a>
					</div>

					<div>
						<p className="text-gray-500 text-sm">Portfolio</p>
						<a
							href="https://yourportfolio.com"
							target="_blank"
							className="text-blue-600 hover:underline"
						>
							View My Portfolio
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}