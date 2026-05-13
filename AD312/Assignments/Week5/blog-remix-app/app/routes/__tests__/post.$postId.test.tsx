import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import PostView from "../post.$postId";
import type Post from "~/interfaces/post";
import { createRoutesStub, useParams } from "react-router";
import { Layout } from "~/root";

// Mock React Router
vi.mock("react-router", async () => {
	const actual = await vi.importActual("react-router");
	return {
		...actual,
		useParams: vi.fn(),
	};
});

const mockPosts: Post[] = [
	{
		id: 1,
		title: "React Router Tips",
		content: "Use Link instead of anchor tags...",
	},
	{ id: 2, title: "State Management", content: "Context API vs Redux..." },
	{ id: 3, title: "The Future of Web", content: "AI and React are merging..." },
];

describe("Post Detail Page (post.$postId)", () => {
	// Standard Tests
	it("renders post title and content when post is found", () => {
		const route = "/post/1";
		const Stub = createRoutesStub([
			{
				path: route,
				Component: PostView,
				HydrateFallback: Layout,
				loader() {
					return {
						mockPosts,
					};
				},
			},
		]);

		render(<Stub initialEntries={[route]} />);

		waitFor(() => {
			expect(screen.getByText("React Router Tips")).toBeTruthy();
			expect(
				screen.getByText("Use Link instead of anchor tags..."),
			).toBeTruthy();
		});
	});

	it("displays correct post for different IDs", () => {
		const route = "/post/2";
		const Stub = createRoutesStub([
			{
				path: route,
				Component: PostView,
				HydrateFallback: Layout,
				loader() {
					return {
						mockPosts,
					};
				},
			},
		]);

		render(<Stub initialEntries={[route]} />);

		waitFor(() => {
			expect(screen.getByText("State Management")).toBeTruthy();
			expect(screen.getByText("Context API vs Redux...")).toBeTruthy();
			expect(screen.queryByText("React Router Tips")).toBeNull();
		});
	});

	// Edge Case Tests
	it("shows 'No post found' message when post ID does not exist", () => {
		const route = "/post/999";
		const Stub = createRoutesStub([
			{
				path: route,
				Component: PostView,
				HydrateFallback: Layout,
				loader() {
					return {
						mockPosts,
					};
				},
			},
		]);

		render(<Stub initialEntries={[route]} />);

		waitFor(() => {
			expect(screen.getByText("No post found!")).toBeTruthy();
		});
	});
});
