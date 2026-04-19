import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Gallery from "./Gallery";

const mockImages = [
	{ url: "image1.jpg" },
	{ url: "image2.jpg" },
	{ url: "image3.jpg" },
];

describe("Gallery Component", () => {
	// Standard Test 1: Renders the first image initially
	it("renders the first image initially", () => {
		render(<Gallery images={mockImages} />);
		const img = screen.getByRole("img");
		expect(img).toHaveAttribute("src", "image1.jpg");
		expect(screen.getByText("Current Index: 0")).toBeInTheDocument();
	});

	// Standard Test 2: Clicking Next button advances to the next image
	it("advances to the next image when Next button is clicked", () => {
		render(<Gallery images={mockImages} />);
		const nextButton = screen.getByRole("button", { name: /next/i });
		fireEvent.click(nextButton);
		expect(screen.getByText("Current Index: 1")).toBeInTheDocument();
		const img = screen.getByRole("img");
		expect(img).toHaveAttribute("src", "image2.jpg");
	});

	// Standard Test 3: Clicking Previous button goes back to the previous image
	it("goes back to the previous image when Previous button is clicked", () => {
		render(<Gallery images={mockImages} />);
		const nextButton = screen.getByRole("button", { name: /next/i });
		fireEvent.click(nextButton); // Go to index 1
		const prevButton = screen.getByRole("button", { name: /previous/i });
		fireEvent.click(prevButton); // Go back to index 0
		expect(screen.getByText("Current Index: 0")).toBeInTheDocument();
		const img = screen.getByRole("img");
		expect(img).toHaveAttribute("src", "image1.jpg");
	});

	// Edge Case 1: Clicking Previous when at the first image does not go below 0
	it("does not go below index 0 when Previous is clicked at first image", () => {
		render(<Gallery images={mockImages} />);
		const prevButton = screen.getByRole("button", { name: /previous/i });
		fireEvent.click(prevButton);
		expect(screen.getByText("Current Index: 0")).toBeInTheDocument();
		const img = screen.getByRole("img");
		expect(img).toHaveAttribute("src", "image1.jpg");
	});

	// Edge Case 2: Clicking Next when at the last image does not go beyond the last index
	it("does not go beyond the last index when Next is clicked at last image", () => {
		render(<Gallery images={mockImages} />);
		const nextButton = screen.getByRole("button", { name: /next/i });
		fireEvent.click(nextButton); // 0 -> 1
		fireEvent.click(nextButton); // 1 -> 2
		fireEvent.click(nextButton); // Try to go to 3, but should stay at 2
		expect(screen.getByText("Current Index: 2")).toBeInTheDocument();
		const img = screen.getByRole("img");
		expect(img).toHaveAttribute("src", "image3.jpg");
	});

	// Edge Case 3: Handles single image array correctly
	it("handles single image array without navigation issues", () => {
		const singleImage = [{ url: "single.jpg" }];
		render(<Gallery images={singleImage} />);
		expect(screen.getByText("Current Index: 0")).toBeInTheDocument();
		const img = screen.getByRole("img");
		expect(img).toHaveAttribute("src", "single.jpg");

		const nextButton = screen.getByRole("button", { name: /next/i });
		fireEvent.click(nextButton);
		expect(screen.getByText("Current Index: 0")).toBeInTheDocument(); // Should stay at 0

		const prevButton = screen.getByRole("button", { name: /previous/i });
		fireEvent.click(prevButton);
		expect(screen.getByText("Current Index: 0")).toBeInTheDocument(); // Should stay at 0
	});
});
