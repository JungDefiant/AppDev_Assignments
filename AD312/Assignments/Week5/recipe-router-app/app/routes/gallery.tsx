import { galleryEntries } from "~/data/galleryEntries";
import { Link } from "react-router";

import type GalleryEntry from "~/data/galleryEntry";
import type { Route } from "./+types/gallery";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	return { galleryEntries };
}

export default function Gallery({ loaderData }: Route.ComponentProps) {
	const { galleryEntries } = loaderData;

	return (
		<nav
			style={{
				marginBottom: 20,
				display: "flex",
				flexDirection: "column",
				gap: 8,
			}}
		>
			{galleryEntries.map((galleryEntry: GalleryEntry) => {
				return (
					<Link to={`/recipe/${galleryEntry.id}`}>
						<img width={240} src={galleryEntry.url as string} />
					</Link>
				);
			})}
		</nav>
	);
}
