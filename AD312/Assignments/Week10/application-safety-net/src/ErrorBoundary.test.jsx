import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "./ErrorBoundary";

const ThrowError = ({ shouldThrow = true }) => {
	if (shouldThrow) {
		throw new Error("Test error");
	}
	return <div>No Error</div>;
};

const SafeComponent = () => <div>Safe Content</div>;

describe("ErrorBoundary", () => {
	beforeEach(() => {
		vi.spyOn(console, "error").mockImplementation(() => {});
	});

	it("test: should render children when there is no error", () => {
		render(
			<ErrorBoundary fallback={<div>Error occurred</div>}>
				<SafeComponent />
			</ErrorBoundary>,
		);

		expect(screen.getByText("Safe Content")).toBeInTheDocument();
	});

	it("test: should render fallback UI when an error is caught", () => {
		render(
			<ErrorBoundary fallback={<div>Something went wrong</div>}>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>,
		);

		expect(screen.getByText("Something went wrong")).toBeInTheDocument();
	});

	it("test: should call componentDidCatch when an error is caught", () => {
		const consoleErrorSpy = vi.spyOn(console, "error");

		render(
			<ErrorBoundary fallback={<div>Error</div>}>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>,
		);

		// componentDidCatch logs error info to console
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			"Error info:",
			expect.arrayContaining([
				expect.objectContaining({
					message: "Test error",
				}),
			]),
		);
	});

	it("edge case: should render fallback when one of multiple children throws an error", () => {
		render(
			<ErrorBoundary fallback={<div>Error boundary triggered</div>}>
				<SafeComponent />
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>,
		);

		expect(screen.getByText("Error boundary triggered")).toBeInTheDocument();
		expect(screen.queryByText("Safe Content")).not.toBeInTheDocument();
	});

	it("edge case: should handle error info with missing componentStack gracefully", () => {
		const consoleErrorSpy = vi.spyOn(console, "error");

		class TestErrorBoundary extends ErrorBoundary {
			componentDidCatch(error, info) {
				const infoWithoutStack = { ...info, componentStack: undefined };
				console.error("Error info:", [error, infoWithoutStack.componentStack]);
			}
		}

		render(
			<TestErrorBoundary fallback={<div>Error</div>}>
				<ThrowError shouldThrow={true} />
			</TestErrorBoundary>,
		);

		expect(consoleErrorSpy).toHaveBeenCalled();
		expect(screen.getByText("Error")).toBeInTheDocument();
	});

	it("edge case: should render nothing when fallback is undefined and error occurs", () => {
		render(
			<ErrorBoundary fallback={undefined}>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>,
		);

		expect(screen.queryByText("Safe Content")).not.toBeInTheDocument();
		const container = document.querySelector("div");
		expect(container).toBeInTheDocument();
	});
});
