import { render, screen, fireEvent, within } from "@testing-library/react";
import { afterEach, describe, test, expect, vi } from "vitest";
import ShoppingList from "./ShoppingListWithImmer";

describe("ShoppingListWithImmer", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	test("renders initial shopping list items", () => {
		render(
			<ShoppingList
				itemArray={[
					{
						id: 1,
						name: "Apple",
						quantity: 1,
						details: { category: "fruit", notes: "fresh" },
					},
					{
						id: 2,
						name: "Bread",
						quantity: 2,
						details: { category: "bakery", notes: "whole grain" },
					},
				]}
			/>,
		);

		expect(screen.getByText("Apple")).toBeTruthy();
		expect(screen.getByText("x1")).toBeTruthy();
		expect(screen.getByText(/Category: fruit/i)).toBeTruthy();
		expect(screen.getByText(/Notes: fresh/i)).toBeTruthy();
		expect(screen.getByText("Bread")).toBeTruthy();
		expect(screen.getByText("x2")).toBeTruthy();
	});

	test("adds a new item when prompts return values", () => {
		const promptResponses = ["Bananas", "5", "fruit", "ripe"];
		vi.spyOn(window, "prompt").mockImplementation(() =>
			promptResponses.shift(),
		);

		render(
			<ShoppingList
				itemArray={[
					{
						id: 1,
						name: "Apple",
						quantity: 1,
						details: { category: "fruit", notes: "fresh" },
					},
				]}
			/>,
		);

		fireEvent.click(screen.getByText("Add Item"));

		expect(screen.getByText("Bananas")).toBeTruthy();
		expect(screen.getByText("x5")).toBeTruthy();
		expect(screen.getAllByText(/Category: fruit/i).length).toEqual(2);
		expect(screen.getAllByText(/Notes: ripe/i).length).toEqual(1);
	});

	test("removes an item by id when valid prompt response is provided", () => {
		vi.spyOn(window, "prompt").mockImplementation(() => "2");

		render(
			<ShoppingList
				itemArray={[
					{
						id: 1,
						name: "Apple",
						quantity: 1,
						details: { category: "fruit", notes: "fresh" },
					},
					{
						id: 2,
						name: "Bread",
						quantity: 2,
						details: { category: "bakery", notes: "whole grain" },
					},
				]}
			/>,
		);

		fireEvent.click(screen.getByText("Remove Item"));

		expect(screen.queryByText("Bread")).toBeNull();
		expect(screen.getByText("Apple")).toBeTruthy();
	});

	test("renders no items when itemArray is empty", () => {
		render(<ShoppingList itemArray={[]} />);

		expect(screen.queryByText("1.")).toBeNull();
		expect(screen.queryByText(/Category:/i)).toBeNull();
		expect(screen.queryByText(/Notes:/i)).toBeNull();
	});

	test("does not remove an item on invalid prompt response", () => {
		vi.spyOn(window, "prompt").mockImplementation(() => "");

		render(
			<ShoppingList
				itemArray={[
					{
						id: 1,
						name: "Apple",
						quantity: 1,
						details: { category: "fruit", notes: "fresh" },
					},
				]}
			/>,
		);

		fireEvent.click(screen.getByText("Remove Item"));

		expect(screen.getByText("Apple")).toBeInTheDocument();
	});

	test("adds a new item with defaults when prompt responses are blank", () => {
		const promptResponses = ["", "", "", ""];
		vi.spyOn(window, "prompt").mockImplementation(() =>
			promptResponses.shift(),
		);

		render(
			<ShoppingList
				itemArray={[
					{
						id: 1,
						name: "Apple",
						quantity: 1,
						details: { category: "fruit", notes: "fresh" },
					},
				]}
			/>,
		);

		fireEvent.click(screen.getByText("Add Item"));

		expect(screen.getByText("N/A")).toBeTruthy();
		expect(screen.getByText("x0")).toBeTruthy();
		expect(screen.getByText(/Category: N\/A/i)).toBeTruthy();
		expect(screen.getByText(/Notes: N\/A/i)).toBeTruthy();
	});
});
