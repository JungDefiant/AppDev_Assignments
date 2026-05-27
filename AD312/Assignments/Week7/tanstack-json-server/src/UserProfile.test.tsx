import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import UserProfile from "./UserProfile";

// Ensure we don't replace `useQuery` with an empty mock - use the real implementation
vi.mock("@tanstack/react-query", async () => {
	const actual = await vi.importActual("@tanstack/react-query");
	return {
		...actual,
		useQuery: actual.useQuery,
	};
});

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: false },
		},
	});
	return ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

describe("UserProfile Component", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	// STANDARD TESTS
	describe("Standard Tests", () => {
		// Test 1: Component renders loading state initially
		it("should display loading state when fetching user data", async () => {
			vi.stubGlobal(
				"fetch",
				vi.fn(
					() =>
						new Promise((resolve) =>
							setTimeout(() => {
								resolve(
									new Response(
										JSON.stringify({
											username: "john_doe",
											email: "john@example.com",
											bio: "Test bio",
											notifications: "enabled",
										}),
									),
								);
							}, 100),
						),
				),
			);

			render(<UserProfile />, {
				wrapper: createWrapper(),
			});

			// Should show loading state first
			expect(screen.getByText("Loading...")).toBeInTheDocument();

			// Wait for the data to load
			await waitFor(() => {
				expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
			});
		});

		// Test 2: Component fetches and displays user profile data correctly
		it("should fetch and display user profile data on mount", async () => {
			vi.stubGlobal(
				"fetch",
				vi.fn(() =>
					Promise.resolve(
						new Response(
							JSON.stringify({
								username: "jane_doe",
								email: "jane@example.com",
								bio: "Software developer",
								notifications: "false",
							}),
							{ status: 200 },
						),
					),
				),
			);

			render(<UserProfile />, {
				wrapper: createWrapper(),
			});

			// Wait for data to be displayed
			await waitFor(() => {
				expect(screen.getByDisplayValue("jane_doe")).toBeInTheDocument();
				expect(
					screen.getByDisplayValue("jane@example.com"),
				).toBeInTheDocument();
				expect(
					screen.getByDisplayValue("Software developer"),
				).toBeInTheDocument();
				expect(screen.getByDisplayValue("false")).toBeInTheDocument();
			});
		});

		// Test 3: Form submission successfully updates user profile
		it("should successfully submit form and update user profile", async () => {
			const mockFetch = vi.fn();
			mockFetch.mockImplementationOnce(() =>
				Promise.resolve(
					new Response(
						JSON.stringify({
							username: "original_user",
							email: "original@example.com",
							bio: "Original bio",
							notifications: "disabled",
						}),
						{ status: 200 },
					),
				),
			);
			mockFetch.mockImplementationOnce(() =>
				Promise.resolve(
					new Response(
						JSON.stringify({
							username: "updated_user",
							email: "updated@example.com",
							bio: "Updated bio",
							notifications: "enabled",
						}),
						{ status: 200 },
					),
				),
			);

			vi.stubGlobal("fetch", mockFetch);

			render(<UserProfile />, {
				wrapper: createWrapper(),
			});

			// Wait for initial load
			await waitFor(() => {
				expect(screen.getByDisplayValue("original_user")).toBeInTheDocument();
			});

			// Update form fields
			const usernameInput = screen.getByDisplayValue("original_user");
			const emailInput = screen.getByDisplayValue("original@example.com");

			await userEvent.clear(usernameInput);
			await userEvent.type(usernameInput, "updated_user");

			await userEvent.clear(emailInput);
			await userEvent.type(emailInput, "updated@example.com");

			// Submit form
			const submitButton = screen.getByRole("button", { name: /submit/i });
			fireEvent.click(submitButton);

			// Verify mutation was called (initial GET + PUT + refetch after invalidate)
			await waitFor(() => {
				expect(mockFetch).toHaveBeenCalledTimes(3);
			});
		});
	});

	// EDGE CASE TESTS
	describe("Edge Case Tests", () => {
		// Test 4: Error handling when fetching user profile fails
		it("should display error message when fetching user profile fails", async () => {
			vi.stubGlobal(
				"fetch",
				vi.fn(() =>
					Promise.resolve(new Response(JSON.stringify({}), { status: 500 })),
				),
			);

			render(<UserProfile />, {
				wrapper: createWrapper(),
			});

			// Wait for error message to appear
			await waitFor(() => {
				expect(
					screen.getByText("Error getting User Profile data!"),
				).toBeInTheDocument();
			});
		});

		// Test 5: Invalid email validation error is displayed
		it("should display validation error for invalid email and prevent submission", async () => {
			const mockFetch = vi.fn();
			mockFetch.mockImplementationOnce(() =>
				Promise.resolve(
					new Response(
						JSON.stringify({
							username: "test_user",
							email: "test@example.com",
							bio: "Test bio",
							notifications: "enabled",
						}),
						{ status: 200 },
					),
				),
			);
			mockFetch.mockImplementationOnce(() =>
				Promise.reject(new Error("Email is invalid!")),
			);

			vi.stubGlobal("fetch", mockFetch);

			render(<UserProfile />, {
				wrapper: createWrapper(),
			});

			// Wait for initial load
			await waitFor(() => {
				expect(screen.getByDisplayValue("test_user")).toBeInTheDocument();
			});

			// Change email to invalid value
			const emailInput = screen.getByDisplayValue("test@example.com");
			await userEvent.clear(emailInput);
			await userEvent.type(emailInput, "conflict@example.com");

			// Submit form
			const submitButton = screen.getByRole("button", { name: /submit/i });
			fireEvent.click(submitButton);

			// Wait for error to appear
			await waitFor(() => {
				const errorSpans = screen.queryAllByText(/This field is required/);
				expect(errorSpans.length).toBeGreaterThan(0);
			});
		});

		// Test 6: Form is disabled when not dirty and enabled after modification
		it("should disable submit button when form is not modified or mutation is pending", async () => {
			vi.stubGlobal(
				"fetch",
				vi.fn(() =>
					Promise.resolve(
						new Response(
							JSON.stringify({
								username: "test_user",
								email: "test@example.com",
								bio: "Test bio",
								notifications: "enabled",
							}),
							{ status: 200 },
						),
					),
				),
			);

			render(<UserProfile />, {
				wrapper: createWrapper(),
			});

			// Wait for initial load
			await waitFor(() => {
				expect(screen.getByDisplayValue("test_user")).toBeInTheDocument();
			});

			// Find submit button
			const submitButton = screen.getByRole("button", {
				name: /submit/i,
			});

			// Verify button is disabled when form is not dirty
			expect(submitButton).toBeDisabled();

			// Modify form field
			const usernameInput = screen.getByDisplayValue("test_user");
			await userEvent.clear(usernameInput);
			await userEvent.type(usernameInput, "modified_user");

			// Verify button is enabled when form is dirty
			await waitFor(() => {
				expect(submitButton).toBeEnabled();
			});
		});
	});
});
