import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, beforeEach, vi, expect } from "vitest";
import UserProfile from "./UserProfileWithImmer";

// Mock window.prompt
global.prompt = vi.fn();

describe("UserProfile Component - Standard Tests", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	// Standard Test 1: Component renders with initial empty profile
	test("should render with initial empty profile state", () => {
		render(<UserProfile />);

		expect(screen.getByText("User Profile")).toBeInTheDocument();
		expect(screen.getAllByDisplayValue("")).toHaveLength(2); // name and email inputs are empty
		expect(screen.getByText("Name:")).toBeInTheDocument();
		expect(screen.getByText("Email:")).toBeInTheDocument();
		expect(screen.getByText("- Phone:")).toBeInTheDocument();
		expect(screen.getByText("- Address:")).toBeInTheDocument();
	});

	// Standard Test 2: Form submission updates name and email
	test("should update name and email when form is submitted with values", async () => {
		render(<UserProfile />);

		const inputs = screen.getAllByRole("textbox");
		const nameInput = inputs[0];
		const emailInput = inputs[1];
		const submitButton = screen.getByText("Submit");

		await userEvent.type(nameInput, "John Doe");
		await userEvent.type(emailInput, "john@example.com");
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
			expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
		});
	});

	// Standard Test 3: Newsletter toggle works correctly
	test("should toggle newsletter subscription when button is clicked", async () => {
		render(<UserProfile />);

		// Initial state should be true (based on default in component)
		expect(
			screen.getByText("- Newsletter Subscription: true"),
		).toBeInTheDocument();

		const toggleButton = screen.getByText("Toggle Newsletter Subscription");
		fireEvent.click(toggleButton);

		await waitFor(() => {
			expect(
				screen.getByText("- Newsletter Subscription: false"),
			).toBeInTheDocument();
		});

		// Click again to toggle back
		fireEvent.click(toggleButton);

		await waitFor(() => {
			expect(
				screen.getByText("- Newsletter Subscription: true"),
			).toBeInTheDocument();
		});
	});
});

describe("UserProfile Component - Edge Case Tests", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	// Edge Case 1: Partial form submission - only name provided, email empty
	test("should update only name when only name is provided and email is empty", async () => {
		render(<UserProfile />);

		const inputs = screen.getAllByRole("textbox");
		const nameInput = inputs[0];
		const submitButton = screen.getByText("Submit");

		await userEvent.type(nameInput, "Jane Smith");
		// Leave email input empty (default is empty)
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByDisplayValue("Jane Smith")).toBeInTheDocument();
			expect(screen.getAllByDisplayValue("")).toHaveLength(1); // only email is empty
		});
	});

	// Edge Case 2: Empty string submission should preserve existing values
	test("should preserve existing values when form is submitted with empty strings", async () => {
		render(<UserProfile />);

		const inputs = screen.getAllByRole("textbox");
		const nameInput = inputs[0];
		const emailInput = inputs[1];
		const submitButton = screen.getByText("Submit");

		// First submission with valid data
		await userEvent.type(nameInput, "Original Name");
		await userEvent.type(emailInput, "original@email.com");
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByDisplayValue("Original Name")).toBeInTheDocument();
		});

		// Clear inputs and resubmit (empty strings)
		await userEvent.clear(nameInput);
		await userEvent.clear(emailInput);
		fireEvent.click(submitButton);

		await waitFor(() => {
			// The displayed values in the profile should be preserved
			// The paragraph containing the name should still show Original Name
			const nameParagraph = screen.getAllByRole("paragraph")[0];
			expect(nameParagraph.textContent).toContain("Original Name");
		});
	});

	// Edge Case 3: Update contact details with prompt cancellation
	test("should handle prompt cancellation gracefully when updating contact details", async () => {
		prompt.mockReturnValueOnce(null); // Simulate cancel on first prompt
		prompt.mockReturnValueOnce(null); // Simulate cancel on second prompt

		render(<UserProfile />);

		const updateContactButton = screen.getByText("Update Contact Details");
		fireEvent.click(updateContactButton);

		await waitFor(() => {
			expect(screen.getByText("- Phone:")).toBeInTheDocument();
			expect(screen.getByText("- Address:")).toBeInTheDocument();
		});
	});

	// Edge Case 4: Rapid consecutive updates to form fields
	test("should handle rapid consecutive form submissions correctly", async () => {
		render(<UserProfile />);

		const inputs = screen.getAllByRole("textbox");
		const nameInput = inputs[0];
		const emailInput = inputs[1];
		const submitButton = screen.getByText("Submit");

		// First submission
		await userEvent.type(nameInput, "First Update");
		await userEvent.type(emailInput, "first@email.com");
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByDisplayValue("First Update")).toBeInTheDocument();
		});

		// Immediately clear and submit again
		await userEvent.clear(nameInput);
		await userEvent.clear(emailInput);
		await userEvent.type(nameInput, "Second Update");
		await userEvent.type(emailInput, "second@email.com");
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByDisplayValue("Second Update")).toBeInTheDocument();
			expect(screen.getByDisplayValue("second@email.com")).toBeInTheDocument();
		});
	});

	// Edge Case 5: Multiple newsletter toggles in rapid succession
	test("should correctly handle rapid consecutive newsletter toggle clicks", async () => {
		render(<UserProfile />);

		const toggleButton = screen.getByText("Toggle Newsletter Subscription");

		// Perform 3 rapid clicks
		fireEvent.click(toggleButton);
		fireEvent.click(toggleButton);
		fireEvent.click(toggleButton);

		// After 3 clicks, it should be false (started as true)
		await waitFor(() => {
			expect(
				screen.getByText("- Newsletter Subscription: false"),
			).toBeInTheDocument();
		});

		// One more click to verify
		fireEvent.click(toggleButton);

		await waitFor(() => {
			expect(
				screen.getByText("- Newsletter Subscription: true"),
			).toBeInTheDocument();
		});
	});
});
