import { PaginationUI } from "./paginationBase";

export function PaginationLinks({
	currentPage,
	totalPages,
	basePath,
}: {
	currentPage: number;
	totalPages: number;
	basePath: string;
}) {
	return (
		<PaginationUI
			currentPage={currentPage}
			totalPages={totalPages}
			previousHref={
				currentPage > 1 ? `${basePath}?page=${currentPage - 1}` : undefined
			}
			nextHref={
				currentPage < totalPages
					? `${basePath}?page=${currentPage + 1}`
					: undefined
			}
		/>
	);
}
