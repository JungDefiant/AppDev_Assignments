import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import type Post from "~/interfaces/post";
import Home from "../_index";
import { Layout } from "~/root";
import { createRoutesStub } from "react-router";

// Mock React Router
vi.mock("react-router", async () => {
	const actual = await vi.importActual("react-router");
	return {
		...actual,
		Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
			<a href={to}>{children}</a>
		),
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

describe("Home Page (_index)", () => {
	// Standard Tests
	it("renders all posts from loader data", () => {
		const Stub = createRoutesStub([
			{
				path: "/",
				Component: Home,
				HydrateFallback: Layout,
				loader() {
					return {
						mockPosts,
					};
				},
			},
		]);

		render(<Stub initialEntries={["/"]} />);

		waitFor(() => {
			expect(screen.getByText("React Router Tips")).toBeTruthy();
			expect(screen.getByText("State Management")).toBeTruthy();
			expect(screen.getByText("The Future of Web")).toBeTruthy();
		});
	});

	// Edge Case Tests
	it("handles empty posts list gracefully", () => {
		const Stub = createRoutesStub([
			{
				path: "/",
				Component: Home,
				HydrateFallback: Layout,
				loader() {
					return {
						posts: [],
					};
				},
			},
		]);

		const { container } = render(<Stub initialEntries={["/"]} />);

		waitFor(() => {
			expect(screen.queryByRole("link")).toBeNull();
			expect(container.querySelector("nav")).toBeTruthy();
		});
	});

	it("handles posts with special characters and long titles", () => {
		const specialPosts: Post[] = [
			{ id: 1, title: "React & Router: Tips & Tricks", content: "Content" },
			{
				id: 2,
				title:
					"Very Long Title That Might Wrap: Understanding React Router v7 and How It Works",
				content: "Content",
			},
		];

		const Stub = createRoutesStub([
			{
				path: "/",
				Component: Home,
				HydrateFallback: Layout,
				loader() {
					return {
						specialPosts,
					};
				},
			},
		]);

		render(<Stub initialEntries={["/"]} />);

		waitFor(() => {
			expect(screen.getByText("React & Router: Tips & Tricks")).toBeTruthy();
			expect(
				screen.getByText(
					"Very Long Title That Might Wrap: Understanding React Router v7 and How It Works",
				),
			).toBeTruthy();
		});
	});
});
