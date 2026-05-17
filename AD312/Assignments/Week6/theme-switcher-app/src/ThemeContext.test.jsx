import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
	ThemeProvider,
	ThemeContext,
	LightTheme,
	DarkTheme,
} from "./ThemeContext.jsx";
import { waitFor } from "@testing-library/react";

function TestComponent() {
	return (
		<ThemeContext.Consumer>
			{({ theme, setTheme }) => (
				<div>
					<span data-testid="current-theme">{theme}</span>
					<button onClick={() => setTheme("light")}>Light</button>
					<button onClick={() => setTheme("dark")}>Dark</button>
				</div>
			)}
		</ThemeContext.Consumer>
	);
}

describe("ThemeProvider", () => {
	it("renders children", () => {
		render(
			<ThemeProvider>
				<div data-testid="child">Child Content</div>
			</ThemeProvider>,
		);
		expect(screen.getByTestId("child")).toBeInTheDocument();
	});

	it("starts with light theme by default", () => {
		render(
			<ThemeProvider>
				<TestComponent />
			</ThemeProvider>,
		);
		expect(screen.getByTestId("current-theme")).toHaveTextContent("light");
	});

	it("allows switching to dark theme", async () => {
		const user = userEvent.setup();
		render(
			<ThemeProvider>
				<TestComponent />
			</ThemeProvider>,
		);

		await user.click(screen.getByText("Dark"));
		expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");
	});

	it("allows switching back to light theme", async () => {
		const user = userEvent.setup();
		render(
			<ThemeProvider>
				<TestComponent />
			</ThemeProvider>,
		);

		await user.click(screen.getByText("Dark"));
		await user.click(screen.getByText("Light"));
		expect(screen.getByTestId("current-theme")).toHaveTextContent("light");
	});

	it("applies LightTheme styles when theme is light", () => {
		render(
			<ThemeProvider>
				<div data-testid="styled-div">Styled</div>
			</ThemeProvider>,
		);
		const div = screen.getByTestId("styled-div");
		waitFor(() => {
			expect(div.style.background).toBe("white");
			expect(div.style.color).toBe("black");
		});
	});

	it("applies DarkTheme styles when theme is dark", async () => {
		const user = userEvent.setup();
		render(
			<ThemeProvider>
				<TestComponent />
				<div data-testid="styled-div">Styled</div>
			</ThemeProvider>,
		);

		await user.click(screen.getByText("Dark"));
		waitFor(() => {
			const div = screen.getByTestId("styled-div");
			expect(div.style.background).toBe("#222021");
			expect(div.style.color).toBe("white");
		});
	});
});
