import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DogList from "./DogList";

// Mock the useQuery hook
vi.mock("@tanstack/react-query", async () => {
	const actual = await vi.importActual("@tanstack/react-query");
	const mockUseQuery = vi.fn();
	return {
		...actual,
		useQuery: mockUseQuery,
	};
});

import { useQuery } from "@tanstack/react-query";

// Create a test wrapper with QueryClient
const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});
	return ({ children }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

describe("DogList Component", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		useQuery.mockImplementation(() => ({
			data: null,
			isPending: true,
			isError: false,
			error: null,
			isSuccess: false,
		}));
	});

	describe("Standard Tests", () => {
		it("renders breeds list by default", async () => {
			// Mock successful breeds fetch
			const mockBreedsData = {
				data: [
					{
						id: "1",
						attributes: {
							name: "Labrador Retriever",
							description: "Friendly and outgoing",
						},
					},
					{
						id: "2",
						attributes: {
							name: "German Shepherd",
							description: "Intelligent and loyal",
						},
					},
				],
			};

			useQuery.mockImplementation((options) => {
				if (options.queryKey[0] === "dogBreeds") {
					return {
						data: mockBreedsData,
						isPending: false,
						isError: false,
						error: null,
						isSuccess: true,
					};
				}
				return {
					data: null,
					isPending: true,
					isError: false,
					error: null,
					isSuccess: false,
				};
			});

			render(<DogList />, { wrapper: createWrapper() });

			expect(screen.getByText("Dog Breeds")).toBeInTheDocument();
			await waitFor(() => {
				expect(screen.getByText("Labrador Retriever")).toBeInTheDocument();
				expect(screen.getByText("German Shepherd")).toBeInTheDocument();
			});
		});

		it("can switch to facts mode and displays facts", async () => {
			// Mock successful facts fetch
			const mockFactsData = {
				data: [
					{
						id: "1",
						attributes: {
							body: "Dogs have a sense of time.",
						},
					},
					{
						id: "2",
						attributes: {
							body: "Dogs can learn over 1000 words.",
						},
					},
				],
			};

			useQuery.mockImplementation((options) => {
				if (options.queryKey[0] === "dogFacts") {
					return {
						data: mockFactsData,
						isPending: false,
						isError: false,
						error: null,
						isSuccess: true,
					};
				}
				return {
					data: null,
					isPending: true,
					isError: false,
					error: null,
					isSuccess: false,
				};
			});

			render(<DogList />, { wrapper: createWrapper() });

			const factsButton = screen.getByText("Facts");
			fireEvent.click(factsButton);

			expect(screen.getByText("Dog Facts")).toBeInTheDocument();
			await waitFor(() => {
				expect(
					screen.getByText("1. Dogs have a sense of time."),
				).toBeInTheDocument();
				expect(
					screen.getByText("2. Dogs can learn over 1000 words."),
				).toBeInTheDocument();
			});
		});

		it("can switch to groups mode and displays groups", async () => {
			// Mock successful groups fetch
			const mockGroupsData = {
				data: [
					{
						id: "1",
						attributes: {
							name: "Hound",
						},
					},
					{
						id: "2",
						attributes: {
							name: "Terrier",
						},
					},
				],
			};

			useQuery.mockImplementation((options) => {
				if (options.queryKey[0] === "dogGroups") {
					return {
						data: mockGroupsData,
						isPending: false,
						isError: false,
						error: null,
						isSuccess: true,
					};
				}
				return {
					data: null,
					isPending: true,
					isError: false,
					error: null,
					isSuccess: false,
				};
			});

			render(<DogList />, { wrapper: createWrapper() });

			const groupsButton = screen.getByText("Groups");
			fireEvent.click(groupsButton);

			expect(screen.getByText("Dog Groups")).toBeInTheDocument();
			await waitFor(() => {
				expect(screen.getByText("Hound")).toBeInTheDocument();
				expect(screen.getByText("Terrier")).toBeInTheDocument();
			});
		});
	});

	describe("Edge Cases", () => {
		it("shows loading state while fetching", () => {
			useQuery.mockImplementation(() => ({
				data: null,
				isPending: true,
				isError: false,
				error: null,
				isSuccess: false,
			}));

			render(<DogList />, { wrapper: createWrapper() });

			expect(screen.getByText("Loading...")).toBeInTheDocument();
		});

		it("shows error message when fetch fails", () => {
			const mockError = new Error("Network response was not ok");

			useQuery.mockImplementation((options) => {
				if (options.queryKey[0] === "dogBreeds") {
					return {
						data: null,
						isPending: false,
						isError: true,
						error: mockError,
						isSuccess: false,
					};
				}
				return {
					data: null,
					isPending: true,
					isError: false,
					error: null,
					isSuccess: false,
				};
			});

			render(<DogList />, { wrapper: createWrapper() });

			expect(
				screen.getByText("Error: Network response was not ok"),
			).toBeInTheDocument();
		});

		it("handles breed by ID with user input", async () => {
			// Mock successful breed by ID fetch
			const mockBreedData = {
				data: {
					id: "1",
					attributes: {
						name: "Labrador Retriever",
						description: "Friendly and outgoing",
					},
				},
			};

			useQuery.mockImplementation((options) => {
				if (options.queryKey[0] === "dogBreedId") {
					return {
						data: mockBreedData,
						isPending: false,
						isError: false,
						error: null,
						isSuccess: true,
					};
				}
				return {
					data: null,
					isPending: true,
					isError: false,
					error: null,
					isSuccess: false,
				};
			});

			// Mock window.prompt
			const mockPrompt = vi.spyOn(window, "prompt").mockReturnValue("1");

			render(<DogList />, { wrapper: createWrapper() });

			const breedByIdButton = screen.getByText("Breed By Id");
			fireEvent.click(breedByIdButton);

			expect(mockPrompt).toHaveBeenCalledWith("Enter a breed id");
			expect(screen.getByText("Dog Breed by ID")).toBeInTheDocument();

			await waitFor(() => {
				expect(screen.getByText("Labrador Retriever")).toBeInTheDocument();
			});

			mockPrompt.mockRestore();
		});
	});
});
