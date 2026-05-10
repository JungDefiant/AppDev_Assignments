import { Link } from "react-router";
import type { Route } from "./+types/_index";
import type Post from "~/interfaces/post";
import { posts } from "~/data/posts";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	return { posts };
}

export default function Home({ loaderData }: Route.ComponentProps) {
	const { posts } = loaderData;

	return (
		<nav
			style={{
				marginBottom: 20,
				display: "flex",
				flexDirection: "column",
				gap: 8,
			}}
		>
			{posts.map((post: Post) => {
				return (
					<Link to={`/post/${post.id}`}>
						<h1>{post.title}</h1>
					</Link>
				);
			})}
		</nav>
	);
}
