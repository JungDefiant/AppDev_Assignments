/// <reference types="vitest" />
/** biome-ignore-all assist/source/organizeImports: <explanation> */
// @vitest-environment jsdom
import { vi, describe, beforeEach, afterEach, test, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// Create a shared mock chart instance that tests can inspect.
const mockUpdate = vi.fn();
const mockDestroy = vi.fn();
const mockChartInstance = {
	data: { datasets: [{ data: [] }] },
	update: mockUpdate,
	destroy: mockDestroy,
};

// Mock Chart.js BEFORE importing the component so the component uses the mock.
vi.mock("chart.js/auto", () => {
	// define a constructible function so `new Chart(...)` works
	function ChartImpl(_canvas, config) {
		mockChartInstance.data.datasets[0].data = config?.data?.datasets?.[0]?.data
			? [...config.data.datasets[0].data]
			: [];
		return mockChartInstance;
	}

	const Chart = vi.fn(ChartImpl);
	return { Chart };
});
import { Chart } from "chart.js/auto";
import DynamicPoll from "./DynamicPoll";

describe("DynamicPoll Component", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// reset the mock instance between tests
		mockChartInstance.data.datasets[0].data = [];
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("Standard Tests", () => {
		test("should render all poll options as clickable buttons", () => {
			const props = {
				data: [10, 20, 30],
				labels: ["React", "Vue", "Angular"],
				title: "Favorite Framework",
			};

			render(<DynamicPoll {...props} />);

			expect(screen.getByRole("button", { name: "React" })).toBeInTheDocument();
			expect(screen.getByRole("button", { name: "Vue" })).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: "Angular" }),
			).toBeInTheDocument();
		});

		test("should initialize chart with correct data and title on mount", () => {
			const props = {
				data: [15, 25, 35],
				labels: ["Option A", "Option B", "Option C"],
				title: "Sample Poll",
			};

			render(<DynamicPoll {...props} />);

			expect(Chart).toHaveBeenCalledWith(
				expect.any(HTMLCanvasElement),
				expect.objectContaining({
					type: "bar",
					data: expect.objectContaining({
						labels: ["Option A", "Option B", "Option C"],
						datasets: expect.arrayContaining([
							expect.objectContaining({
								label: "Sample Poll",
								data: [15, 25, 35],
							}),
						]),
					}),
				}),
			);
		});

		test("should increment vote count and update chart when button is clicked", async () => {
			const props = {
				data: [5, 10, 15],
				labels: ["Yes", "No", "Maybe"],
				title: "Survey",
			};

			render(<DynamicPoll {...props} />);

			const yesButton = screen.getByRole("button", { name: "Yes" });
			fireEvent.click(yesButton);

			await waitFor(() => {
				expect(mockChartInstance.data.datasets[0].data).toEqual([6, 10, 15]);
				expect(mockChartInstance.update).toHaveBeenCalled();
			});
		});
	});

	describe("Edge Case Tests", () => {
		test("should handle empty labels and data arrays without crashing", () => {
			const props = {
				data: [],
				labels: [],
				title: "Empty Poll",
			};

			render(<DynamicPoll {...props} />);

			// Component should render and Chart should be created
			expect(Chart).toHaveBeenCalled();
			// No buttons should be rendered
			const buttons = screen.queryAllByRole("button");
			expect(buttons).toHaveLength(0);
		});

		test("should handle single option correctly", () => {
			const props = {
				data: [42],
				labels: ["Only Choice"],
				title: "Single Option",
			};

			render(<DynamicPoll {...props} />);

			const button = screen.getByRole("button", { name: "Only Choice" });
			fireEvent.click(button);

			expect(mockChartInstance.update).toHaveBeenCalled();
			expect(mockChartInstance.data.datasets[0].data).toEqual([43]);
		});

		test("should handle very large numbers in data array without overflow", async () => {
			const largeNum = 999999999;
			const props = {
				data: [largeNum, largeNum + 500, largeNum + 1000],
				labels: ["Big A", "Big B", "Big C"],
				title: "Large Numbers",
			};

			render(<DynamicPoll {...props} />);

			const buttonBigA = screen.getByRole("button", { name: "Big A" });
			fireEvent.click(buttonBigA);

			await waitFor(() => {
				expect(mockChartInstance.data.datasets[0].data).toEqual([
					largeNum + 1,
					largeNum + 500,
					largeNum + 1000,
				]);
			});
		});
	});
});
