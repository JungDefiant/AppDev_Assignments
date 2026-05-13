import { describe, it, expect, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import Gallery from "../gallery";
import type GalleryEntry from "~/data/galleryEntry";
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

const mockGalleryEntries: GalleryEntry[] = [
	{
		id: 1,
		url: "https://example.com/recipe1.jpg",
		description: "Delicious Pasta",
	},
	{
		id: 2,
		url: "https://example.com/recipe2.jpg",
		description: "Fresh Salad",
	},
	{
		id: 3,
		url: "https://example.com/recipe3.jpg",
		description: "Chocolate Cake",
	},
];

describe("Gallery Page (gallery)", () => {
	// Standard Tests
	it("renders all gallery entries with images", () => {
		const Stub = createRoutesStub([
			{
				path: "/gallery",
				Component: Gallery,
				loader() {
					return {
						galleryEntries: mockGalleryEntries,
					};
				},
			},
		]);

		const { container } = render(<Stub initialEntries={["/gallery"]} />);

		waitFor(() => {
			const images = container.querySelectorAll("img");
			expect(images).toHaveLength(3);
			expect(images[0].getAttribute("src")).toBe(
				"https://example.com/recipe1.jpg",
			);
			expect(images[1].getAttribute("src")).toBe(
				"https://example.com/recipe2.jpg",
			);
			expect(images[2].getAttribute("src")).toBe(
				"https://example.com/recipe3.jpg",
			);
		});
	});

	it("each gallery entry links to correct recipe path", () => {
		const Stub = createRoutesStub([
			{
				path: "/gallery",
				Component: Gallery,
				loader() {
					return {
						galleryEntries: mockGalleryEntries,
					};
				},
			},
		]);

		const { container } = render(<Stub initialEntries={["/gallery"]} />);

		waitFor(() => {
			const links = container.querySelectorAll("a");
			expect(links).toHaveLength(3);
			expect(links[0].getAttribute("href")).toBe("/recipe/1");
			expect(links[1].getAttribute("href")).toBe("/recipe/2");
			expect(links[2].getAttribute("href")).toBe("/recipe/3");
		});
	});

	// Edge Case Tests
	it("handles empty gallery entries gracefully", () => {
		const Stub = createRoutesStub([
			{
				path: "/gallery",
				Component: Gallery,
				loader() {
					return {
						galleryEntries: [],
					};
				},
			},
		]);

		const { container } = render(<Stub initialEntries={["/gallery"]} />);

		waitFor(() => {
			const images = container.querySelectorAll("img");
			expect(images).toHaveLength(0);
			const nav = container.querySelector("nav");
			expect(nav).toBeTruthy();
		});
	});
});
