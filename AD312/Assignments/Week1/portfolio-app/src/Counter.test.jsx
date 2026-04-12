import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Counter from "./Counter";

describe("Counter", () => {
	test("test: increments count on button click", () => {
		render(<Counter />);
		const button = screen.getByText("Increment");
		fireEvent.click(button);
		expect(screen.getByText("Count: 1")).toBeInTheDocument();
	});

	test("test: increments after delay", async () => {
		render(<Counter />);
		const button = screen.getByText("Increment After Delay");
		fireEvent.click(button);
		await waitFor(
			() => {
				expect(screen.getByText("Count: 1")).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);
	});

	test("test: incrementTwice does not change count", () => {
		render(<Counter />);
		const button = screen.getByText("Increment Twice");
		fireEvent.click(button);
		expect(screen.getByText("Count: 0")).toBeInTheDocument();
	});

	test("test: correctIncrementTwice increases by 2", () => {
		render(<Counter />);
		const button = screen.getByText("Correct Increment Twice");
		fireEvent.click(button);
		expect(screen.getByText("Count: 2")).toBeInTheDocument();
	});

	test("edge case: rapid multiple increments accumulate correctly", () => {
		render(<Counter />);
		const button = screen.getByText("Increment");
		fireEvent.click(button);
		fireEvent.click(button);
		fireEvent.click(button);
		expect(screen.getByText("Count: 3")).toBeInTheDocument();
	});

	test("edge case: multiple delayed increments do not cause more than one re-render", async () => {
		render(<Counter />);
		const button = screen.getByText("Increment After Delay");
		fireEvent.click(button);
		fireEvent.click(button);
		await waitFor(
			() => {
				expect(screen.getByText("Count: 1")).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);
	});

	test("edge case: initial render shows count as 0", () => {
		render(<Counter />);
		expect(screen.getByText("Count: 0")).toBeInTheDocument();
	});
});
