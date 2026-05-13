import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import RecipeGallery from "../recipe.$id";
import type GalleryEntry from "~/data/galleryEntry";
import { createRoutesStub, useParams } from "react-router";

// Mock React Router
vi.mock("react-router", async () => {
	const actual = await vi.importActual("react-router");
	return {
		...actual,
		useParams: vi.fn(),
	};
});

const mockGalleryEntries: GalleryEntry[] = [
	{
		id: 1,
		url: "https://example.com/recipe1.jpg",
		description: "Delicious Pasta with tomato sauce",
	},
	{
		id: 2,
		url: "https://example.com/recipe2.jpg",
		description: "Fresh Garden Salad",
	},
	{
		id: 3,
		url: "https://example.com/recipe3.jpg",
		description: "Decadent Chocolate Cake",
	},
];

describe("Recipe Detail Page (recipe.$id)", () => {
	// Standard Tests
	it("renders recipe image and description when entry is found", () => {
		const route = "/recipe/1";
		const Stub = createRoutesStub([
			{
				path: "/recipe/:entryid",
				Component: RecipeGallery,
				loader() {
					return {
						galleryEntries: mockGalleryEntries,
					};
				},
			},
		]);

		const { container } = render(<Stub initialEntries={[route]} />);

		waitFor(() => {
			const image = container.querySelector("img");
			expect(image?.getAttribute("src")).toBe(
				"https://example.com/recipe1.jpg",
			);
			expect(
				screen.getByText("Delicious Pasta with tomato sauce"),
			).toBeTruthy();
		});
	});

	it("displays correct recipe for different IDs", () => {
		const route = "/recipe/2";
		const Stub = createRoutesStub([
			{
				path: "/recipe/:entryid",
				Component: RecipeGallery,
				loader() {
					return {
						galleryEntries: mockGalleryEntries,
					};
				},
			},
		]);

		const { container } = render(<Stub initialEntries={[route]} />);

		waitFor(() => {
			const image = container.querySelector("img");
			expect(image?.getAttribute("src")).toBe(
				"https://example.com/recipe2.jpg",
			);
			expect(screen.getByText("Fresh Garden Salad")).toBeTruthy();
			expect(
				screen.queryByText("Delicious Pasta with tomato sauce"),
			).toBeNull();
		});
	});

	// Edge Case Tests
	it("shows 'No post found' message when recipe ID does not exist", () => {
		const route = "/recipe/999";
		const Stub = createRoutesStub([
			{
				path: "/recipe/:entryid",
				Component: RecipeGallery,
				loader() {
					return {
						galleryEntries: mockGalleryEntries,
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
