import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import UserProfile from "./UserProfile.jsx";

describe("UserProfile Component", () => {
	// Standard Test 1: Renders the initial profile
	it("renders the initial profile", () => {
		render(<UserProfile />);
		expect(screen.getByTestId("profile-name")).toBeInTheDocument();
		expect(screen.getByTestId("profile-email")).toBeInTheDocument();
		expect(screen.getByTestId("profile-street")).toBeInTheDocument();
		expect(screen.getByTestId("profile-city")).toBeInTheDocument();
		expect(screen.getByTestId("profile-country")).toBeInTheDocument();
	});

	// Standard Test 2: Form submission updates the address correctly
	it("updates address when form is submitted", () => {
		render(<UserProfile />);
		const inputs = screen.getAllByRole("textbox");
		const streetInput = inputs[0];
		const cityInput = inputs[1];
		const countryInput = inputs[2];

		fireEvent.change(streetInput, { target: { value: "123 Main St" } });
		fireEvent.change(cityInput, { target: { value: "New York" } });
		fireEvent.change(countryInput, { target: { value: "USA" } });

		const submitButton = screen.getByRole("button", { name: /submit form/i });
		fireEvent.click(submitButton);

		expect(screen.getByTestId("profile-street")).toHaveTextContent(
			"Street: 123 Main St",
		);
		expect(screen.getByTestId("profile-city")).toHaveTextContent(
			"City: New York",
		);
		expect(screen.getByTestId("profile-country")).toHaveTextContent(
			"Country: USA",
		);
	});

	// Standard Test 3: Initial form values display the current address
	it("form inputs display initial address values", () => {
		render(<UserProfile />);
		const inputs = screen.getAllByRole("textbox");
		expect(inputs[0]).toHaveValue(""); // street initially empty
		expect(inputs[1]).toHaveValue(""); // city initially empty
		expect(inputs[2]).toHaveValue(""); // country initially empty
	});

	// Edge Case 1: Submitting empty form keeps address fields empty
	it("submitting empty form keeps address fields empty", () => {
		render(<UserProfile />);
		const submitButton = screen.getByRole("button", { name: /submit form/i });
		fireEvent.click(submitButton);

		expect(screen.getByTestId("profile-street")).toHaveTextContent("Street:");
		expect(screen.getByTestId("profile-city")).toHaveTextContent("City:");
		expect(screen.getByTestId("profile-country")).toHaveTextContent("Country:");
	});

	// Edge Case 2: Updating only one address field while others remain empty
	it("updates only street field while city and country remain empty", () => {
		render(<UserProfile />);
		const inputs = screen.getAllByRole("textbox");
		fireEvent.change(inputs[0], { target: { value: "456 Oak Ave" } });

		const submitButton = screen.getByRole("button", { name: /submit form/i });
		fireEvent.click(submitButton);

		expect(screen.getByTestId("profile-street")).toHaveTextContent(
			"Street: 456 Oak Ave",
		);
		expect(screen.getByTestId("profile-city")).toHaveTextContent("City:");
		expect(screen.getByTestId("profile-country")).toHaveTextContent("Country:");
	});

	// Edge Case 3: Form submission with special characters in address fields
	it("handles special characters in address fields", () => {
		render(<UserProfile />);
		const inputs = screen.getAllByRole("textbox");
		fireEvent.change(inputs[0], { target: { value: "123 O'Reilly St" } });
		fireEvent.change(inputs[1], { target: { value: "São Paulo" } });
		fireEvent.change(inputs[2], { target: { value: "Côte d'Ivoire" } });

		const submitButton = screen.getByRole("button", { name: /submit form/i });
		fireEvent.click(submitButton);

		expect(screen.getByTestId("profile-street")).toHaveTextContent(
			"Street: 123 O'Reilly St",
		);
		expect(screen.getByTestId("profile-city")).toHaveTextContent(
			"City: São Paulo",
		);
		expect(screen.getByTestId("profile-country")).toHaveTextContent(
			"Country: Côte d'Ivoire",
		);
	});
});
