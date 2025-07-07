import EditStoreForm from "@/app/components/store/EditStoreForm";
import { getStore } from "@/app/utils/requests/storeRequests";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
	title: 'Edit Store',
}

export default async function editStorePage(props: { params: Promise<{ id: string }> }) {
	const params = await props.params;
	const id = params.id
	const [store] = await Promise.all([
		getStore(id)
	])

	if (!store) {
		notFound()
	}

	return (
		<main>
			<EditStoreForm store={store} />
		</main>
	)
}