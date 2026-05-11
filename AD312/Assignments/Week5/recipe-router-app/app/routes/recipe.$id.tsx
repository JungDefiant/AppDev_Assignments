import { useParams } from "react-router";
import { galleryEntries } from "~/data/galleryEntries";

import type GalleryEntry from "~/data/galleryEntry";
import type { Route } from "./+types/gallery";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	return { galleryEntries };
}

export default function RecipeGallery({ loaderData }: Route.ComponentProps) {
	const { entryid } = useParams();
	const { galleryEntries } = loaderData;

	const idNum = Number.parseInt(entryid as string);
	console.log(entryid);
	console.log(idNum);

	const entry: GalleryEntry | undefined = galleryEntries.find(
		(x: GalleryEntry) => x.id === idNum,
	);
	if (!entry) {
		return <div>No post found!</div>;
	}

	return (
		<div>
			<img width={240} src={entry.url as string} />
			<p>{entry.description}</p>
		</div>
	);
}
