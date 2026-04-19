import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TaskManager } from "./TaskManager";

describe("TaskManager", () => {
	let promptSpy;

	beforeEach(() => {
		promptSpy = vi.spyOn(window, "prompt");
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("renders with no tasks initially", () => {
		render(<TaskManager />);

		expect(
			screen.getByRole("button", { name: /add task/i }),
		).toBeInTheDocument();
		expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
	});

	it("adds a new task when a title is provided", () => {
		promptSpy.mockReturnValue("Buy milk");

		render(<TaskManager />);
		fireEvent.click(screen.getByRole("button", { name: /add task/i }));

		expect(screen.getByText("Buy milk")).toBeInTheDocument();
		expect(screen.getByRole("checkbox")).not.toBeChecked();
	});

	it("toggles the completion state of a task when its checkbox is clicked", () => {
		promptSpy.mockReturnValue("Walk the dog");

		render(<TaskManager />);
		fireEvent.click(screen.getByRole("button", { name: /add task/i }));
		const checkbox = screen.getByRole("checkbox");

		expect(checkbox).not.toBeChecked();

		fireEvent.click(checkbox);
		expect(checkbox).toBeChecked();
	});

	it("does not add a task when prompt is canceled", () => {
		promptSpy.mockReturnValue(null);

		render(<TaskManager />);
		fireEvent.click(screen.getByRole("button", { name: /add task/i }));

		expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
		expect(screen.queryByText("null")).not.toBeInTheDocument();
	});

	it("does not add a task when the title is empty", () => {
		promptSpy.mockReturnValue("");

		render(<TaskManager />);
		fireEvent.click(screen.getByRole("button", { name: /add task/i }));

		expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
	});

	it("keeps other tasks unchanged when one task is toggled", () => {
		promptSpy.mockReturnValueOnce("Task One");

		render(<TaskManager />);
		fireEvent.click(screen.getByRole("button", { name: /add task/i }));

		promptSpy.mockReturnValueOnce("Task Two");
		fireEvent.click(screen.getByRole("button", { name: /add task/i }));

		const checkboxes = screen.getAllByRole("checkbox");
		fireEvent.click(checkboxes[0]);

		expect(checkboxes[0]).toBeChecked();
		expect(checkboxes[1]).not.toBeChecked();
	});
});
