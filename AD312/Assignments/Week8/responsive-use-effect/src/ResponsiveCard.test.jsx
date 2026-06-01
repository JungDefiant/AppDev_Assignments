import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import ResponsiveCard from "./ResponsiveCard";

describe("ResponsiveCard Component", () => {
	beforeEach(() => {
		// Mock window dimensions
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			configurable: true,
			value: 1024,
		});
		Object.defineProperty(window, "innerHeight", {
			writable: true,
			configurable: true,
			value: 768,
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	// ===== STANDARD TESTS =====

	/**
	 * Test 1: Component renders without crashing
	 * Verifies that the component mounts successfully and displays the card
	 */
	it("should render the card component without crashing", () => {
		render(<ResponsiveCard />);
		const header = screen.getByText("Card Header");
		expect(header).toBeInTheDocument();
	});

	/**
	 * Test 2: Displays desktop view with correct dimensions
	 * Verifies that when window size exceeds mobile breakpoint,
	 * the card uses desktop dimensions (800x800)
	 */
	it("should apply desktop styles when window size exceeds mobile breakpoint", () => {
		window.innerWidth = 1024;
		window.innerHeight = 800;

		const { container } = render(<ResponsiveCard />);
		const card = container.querySelector('[class*="MuiCard"]');

		expect(card).toHaveStyle({
			width: "800px",
			height: "800px",
			fontSize: "16px",
		});
	});

	/**
	 * Test 3: Displays mobile view with correct dimensions
	 * Verifies that when window size is within mobile breakpoint,
	 * the card uses mobile dimensions (120x120)
	 */
	it("should apply mobile styles when window size is within mobile breakpoint", () => {
		window.innerWidth = 600;
		window.innerHeight = 1000;

		const { container } = render(<ResponsiveCard />);
		const card = container.querySelector('[class*="MuiCard"]');

		expect(card).toHaveStyle({
			width: "120px",
			height: "120px",
			fontSize: "2px",
		});
	});

	// ===== EDGE CASE TESTS =====

	/**
	 * Test 4: Handles exact breakpoint width value (768px)
	 * Verifies behavior when window width equals exactly 768px
	 * (should apply mobile styles as breakpoint uses <=)
	 */
	it("should apply mobile styles when window width equals exactly 768px", () => {
		window.innerWidth = 768;
		window.innerHeight = 2000;

		const { container } = render(<ResponsiveCard />);
		const card = container.querySelector('[class*="MuiCard"]');

		expect(card).toHaveStyle({
			width: "120px",
			height: "120px",
		});
	});

	/**
	 * Test 5: Cleans up event listener on component unmount
	 * Verifies that the resize event listener is properly removed
	 * when component is unmounted to prevent memory leaks
	 */
	it("should remove event listener on component unmount", () => {
		const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

		const { unmount } = render(<ResponsiveCard />);
		unmount();

		expect(removeEventListenerSpy).toHaveBeenCalledWith(
			"resize",
			expect.any(Function),
		);

		removeEventListenerSpy.mockRestore();
	});

	/**
	 * Test 6: Handles rapid resize events correctly
	 * Verifies that multiple consecutive resize events update the
	 * card dimensions correctly without errors or stale state
	 */
	it("should handle multiple rapid resize events and update styles correctly", async () => {
		const { container } = render(<ResponsiveCard />);
		const card = container.querySelector('[class*="MuiCard"]');

		// Initial state - desktop
		window.innerWidth = 1024;
		window.innerHeight = 800;
		fireEvent.resize(window);

		await waitFor(() => {
			expect(card).toHaveStyle({ width: "800px", height: "800px" });
		});

		// Resize to mobile
		window.innerWidth = 600;
		window.innerHeight = 1000;
		fireEvent.resize(window);

		await waitFor(() => {
			expect(card).toHaveStyle({ width: "120px", height: "120px" });
		});

		// Resize back to desktop
		window.innerWidth = 1200;
		window.innerHeight = 900;
		fireEvent.resize(window);

		await waitFor(() => {
			expect(card).toHaveStyle({ width: "800px", height: "800px" });
		});
	});
});
