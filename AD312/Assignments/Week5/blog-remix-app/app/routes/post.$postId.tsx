import { useParams } from "react-router";
import type { Route } from "./+types/post";
import type Post from "~/interfaces/post";
import { posts } from "~/data/posts";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	return { posts };
}

export default function PostView({ loaderData }: Route.ComponentProps) {
	const { postid } = useParams();
	const { posts } = loaderData;

	const idNum = Number.parseInt(postid as string);

	const post: Post | undefined = posts.find((x: Post) => x.id === idNum);
	if (!post) {
		return <div>No post found!</div>;
	}

	return (
		<div>
			<h1>{post.title}</h1>
			<p>{post.content}</p>
		</div>
	);
}
