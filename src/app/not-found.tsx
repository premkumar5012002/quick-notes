export default async function notfound() {
	return (
		<div className="flex flex-col items-center justify-center gap-6 min-h-[calc(100vh-96px)]">
			<div className="text-center space-y-3">
				<h1 className="font-semibold text-3xl">Page not found</h1>
				<p className="text-xl font-medium text-muted-foreground">{`We're unable to find the page you're looking for...`}</p>
			</div>
		</div>
	);
}
