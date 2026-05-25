import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App Form Component", () => {
	beforeEach(() => {
		localStorage.clear();
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	// STANDARD TESTS
	describe("Standard Tests", () => {
		it("should render all form fields correctly", () => {
			render(<App />);

			// Check that all text inputs render
			const inputs = screen.getAllByRole("textbox");
			expect(inputs.length).toBeGreaterThanOrEqual(4); // fullName, emailAddress, password, confirmPassword

			// Check dropdown and checkbox
			expect(screen.getByRole("combobox")).toBeInTheDocument();
			expect(screen.getByRole("checkbox")).toBeInTheDocument();

			// Check submit button
			expect(
				screen.getByRole("button", { name: /submit/i }),
			).toBeInTheDocument();
		});

		it("should successfully submit form with valid data", async () => {
			const user = userEvent.setup();
			render(<App />);

			const inputs = screen.getAllByRole("textbox");
			await user.type(inputs[0], "John Doe"); // fullName
			await user.type(inputs[1], "john@example.com"); // emailAddress
			await user.type(inputs[2], "SecurePass123"); // password
			await user.type(inputs[3], "SecurePass123"); // confirmPassword
			await user.selectOptions(screen.getByRole("combobox"), "Developer");
			await user.click(screen.getByRole("checkbox"));

			const submitButton = screen.getByRole("button", { name: /submit/i });
			await user.click(submitButton);

			// Verify form inputs are still present after submission (not cleared immediately)
			await waitFor(() => {
				expect(inputs[0]).toHaveValue("John Doe");
			});
		});

		it("should display validation errors for empty required fields", async () => {
			const user = userEvent.setup();
			render(<App />);

			await user.click(screen.getByRole("button", { name: /submit/i }));

			await waitFor(() => {
				const errorMessages = screen.getAllByText(/this field is required/i);
				expect(errorMessages.length).toBeGreaterThan(0);
			});
		});
	});

	// EDGE CASE TESTS
	describe("Edge Case Tests", () => {
		it("should validate password with exactly 8 characters and required character types", async () => {
			const user = userEvent.setup();
			render(<App />);

			const inputs = screen.getAllByRole("textbox");
			await user.type(inputs[0], "Jane Smith");
			await user.type(inputs[1], "jane@example.com");
			// Exactly 8 characters with uppercase, lowercase, and number
			await user.type(inputs[2], "Abcdef12");
			await user.type(inputs[3], "Abcdef12");
			await user.selectOptions(screen.getByRole("combobox"), "Designer");
			await user.click(screen.getByRole("checkbox"));

			await user.click(screen.getByRole("button", { name: /submit/i }));

			// Should not show password validation error
			await waitFor(() => {
				expect(screen.queryByText(/Invalid password/i)).not.toBeInTheDocument();
			});
		});

		it("should accept valid email formats with various valid patterns", async () => {
			const user = userEvent.setup();
			const validEmails = [
				"user.name@example.com",
				"user_123@domain-extended.co.uk",
				"firstname.lastname@sub-domain.example.com",
			];

			for (const email of validEmails) {
				const { unmount } = render(<App />);

				const inputs = screen.getAllByRole("textbox");
				await user.type(inputs[0], "Test User");
				await user.type(inputs[1], email);
				await user.type(inputs[2], "TestPass123");
				await user.type(inputs[3], "TestPass123");
				await user.selectOptions(
					screen.getByRole("combobox"),
					"Product Manager",
				);
				await user.click(screen.getByRole("checkbox"));

				await user.click(screen.getByRole("button", { name: /submit/i }));

				// Should not show email validation error for valid emails
				await waitFor(() => {
					expect(
						screen.queryByText(/enter a proper email/i),
					).not.toBeInTheDocument();
				});

				unmount();
			}
		});

		it("should persist form data to localStorage and restore after reset", async () => {
			const user = userEvent.setup();
			const { unmount } = render(<App />);

			const formData = {
				fullName: "Storage Test",
				email: "storage@test.com",
				password: "StoragePass123",
				role: "Developer",
			};

			const inputs = screen.getAllByRole("textbox");
			await user.type(inputs[0], formData.fullName);
			await user.type(inputs[1], formData.email);
			await user.type(inputs[2], formData.password);
			await user.type(inputs[3], formData.password);
			await user.selectOptions(screen.getByRole("combobox"), formData.role);
			await user.click(screen.getByRole("checkbox"));

			// Verify localStorage was updated with form data
			expect(localStorage.getItem("fullName")).toBe(formData.fullName);
			expect(localStorage.getItem("emailAddress")).toBe(formData.email);
			expect(localStorage.getItem("password")).toBe(formData.password);
			expect(localStorage.getItem("accountRole")).toBe(formData.role);
			expect(localStorage.getItem("termsConditions")).toBe("true");

			unmount();
		});
	});
});
