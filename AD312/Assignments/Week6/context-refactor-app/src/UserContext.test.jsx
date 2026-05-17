import { render, screen } from "@testing-library/react";
import { UserProvider, UserContext } from "./UserContext";
import { useContext } from "react";

// Standard Test 1: UserProvider renders children correctly
describe("UserContext - Standard Tests", () => {
	test("UserProvider renders children correctly", () => {
		const TestComponent = () => <div>Test Child Content</div>;
		render(
			<UserProvider>
				<TestComponent />
			</UserProvider>,
		);
		expect(screen.getByText("Test Child Content")).toBeInTheDocument();
	});

	// Standard Test 2: UserContext provides correct initial user data
	test("UserContext provides correct initial user data", () => {
		const TestComponent = () => {
			const { user } = useContext(UserContext);
			return (
				<div>
					<span>{user.name}</span>
					<span>{user.email}</span>
					<span>{user.themePreference}</span>
				</div>
			);
		};
		render(
			<UserProvider>
				<TestComponent />
			</UserProvider>,
		);
		expect(screen.getByText("username")).toBeInTheDocument();
		expect(screen.getByText("email@email.com")).toBeInTheDocument();
		expect(screen.getByText("dark")).toBeInTheDocument();
	});

	// Standard Test 3: UserProvider exposes user object with all required properties
	test("UserProvider exposes user object with all required properties", () => {
		const TestComponent = () => {
			const { user } = useContext(UserContext);
			return <div>{user && Object.keys(user).sort().join(",")}</div>;
		};
		render(
			<UserProvider>
				<TestComponent />
			</UserProvider>,
		);
		// Properties should be: email, name, themePreference (sorted)
		expect(screen.getByText("email,name,themePreference")).toBeInTheDocument();
	});
});

// Edge Case Tests
describe("UserContext - Edge Case Tests", () => {
	// Edge Case Test 1: Multiple consumers access the same context data
	test("Multiple consumers in the same provider access identical context data", () => {
		const Consumer1 = () => {
			const { user } = useContext(UserContext);
			return <div data-testid="consumer1">{user.name}</div>;
		};
		const Consumer2 = () => {
			const { user } = useContext(UserContext);
			return <div data-testid="consumer2">{user.name}</div>;
		};
		render(
			<UserProvider>
				<Consumer1 />
				<Consumer2 />
			</UserProvider>,
		);
		expect(screen.getByTestId("consumer1")).toHaveTextContent("username");
		expect(screen.getByTestId("consumer2")).toHaveTextContent("username");
		expect(screen.getByTestId("consumer1").textContent).toBe(
			screen.getByTestId("consumer2").textContent,
		);
	});

	// Edge Case Test 2: Nested UserProviders maintain separate context instances
	test("Nested UserProviders maintain separate context instances", () => {
		const Consumer = () => {
			const { user } = useContext(UserContext);
			return <div>{user.name}</div>;
		};
		const { rerender } = render(
			<UserProvider>
				<Consumer />
			</UserProvider>,
		);
		const firstText = screen.getByText("username").textContent;

		// Nested provider should have its own context
		rerender(
			<UserProvider>
				<UserProvider>
					<Consumer />
				</UserProvider>
			</UserProvider>,
		);
		expect(screen.getByText("username")).toBeInTheDocument();
	});

	// Edge Case Test 3: Context value structure matches expected shape
	test("Context value maintains correct object structure on multiple renders", () => {
		const valueHistory = [];
		const TestComponent = () => {
			const contextValue = useContext(UserContext);
			valueHistory.push(contextValue);
			return <div>{contextValue.user.name}</div>;
		};
		const { rerender } = render(
			<UserProvider>
				<TestComponent />
			</UserProvider>,
		);
		expect(valueHistory[0]).toHaveProperty("user");
		expect(valueHistory[0].user).toHaveProperty("name");
		expect(valueHistory[0].user).toHaveProperty("email");
		expect(valueHistory[0].user).toHaveProperty("themePreference");
	});
});
