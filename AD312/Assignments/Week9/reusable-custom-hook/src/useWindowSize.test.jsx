/* @vitest-environment jsdom */

import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import useWindowSize from "./useWindowSize";

function TestComponent({ onSizeChange }) {
	const [windowSize] = useWindowSize();
	onSizeChange?.(windowSize);
	return (
		<div data-testid="size">
			{windowSize.width}x{windowSize.height}
		</div>
	);
}

describe("Tests", () => {
	afterEach(() => {
		cleanup();
		vi.resetAllMocks();
	});

	test("Test: returns the current window dimensions initially", () => {
		window.innerWidth = 1024;
		window.innerHeight = 768;

		let size;
		render(<TestComponent onSizeChange={(current) => (size = current)} />);

		expect(size).toEqual({ width: 1024, height: 768 });
		expect(screen.getByTestId("size").textContent).toBe("1024x768");
	});

	test("Test: updates dimensions when the window is resized", () => {
		window.innerWidth = 1200;
		window.innerHeight = 700;

		let size;
		render(<TestComponent onSizeChange={(current) => (size = current)} />);

		act(() => {
			window.innerWidth = 800;
			window.innerHeight = 600;
			window.dispatchEvent(new Event("resize"));
		});

		expect(size).toEqual({ width: 800, height: 600 });
		expect(screen.getByTestId("size").textContent).toBe("800x600");
	});

	test("Test: cleans up the resize event listener on unmount", () => {
		const addSpy = vi.spyOn(window, "addEventListener");
		const removeSpy = vi.spyOn(window, "removeEventListener");

		const { unmount } = render(<TestComponent onSizeChange={() => {}} />);
		unmount();

		expect(addSpy).toHaveBeenCalledWith("resize", expect.any(Function));
		expect(removeSpy).toHaveBeenCalledWith("resize", expect.any(Function));
	});

	test("Edge Case: handles a zero-dimension resize event", () => {
		window.innerWidth = 600;
		window.innerHeight = 500;

		let size;
		render(<TestComponent onSizeChange={(current) => (size = current)} />);

		act(() => {
			window.innerWidth = 0;
			window.innerHeight = 0;
			window.dispatchEvent(new Event("resize"));
		});

		expect(size).toEqual({ width: 0, height: 0 });
		expect(screen.getByTestId("size").textContent).toBe("0x0");
	});

	test("Edge Case: handles a very large resize event", () => {
		window.innerWidth = 1024;
		window.innerHeight = 768;

		let size;
		render(<TestComponent onSizeChange={(current) => (size = current)} />);

		act(() => {
			window.innerWidth = 16000;
			window.innerHeight = 9000;
			window.dispatchEvent(new Event("resize"));
		});

		expect(size).toEqual({ width: 16000, height: 9000 });
		expect(screen.getByTestId("size").textContent).toBe("16000x9000");
	});

	test("Edge Case: applies the latest window size after repeated resize events", () => {
		window.innerWidth = 900;
		window.innerHeight = 700;

		let size;
		render(<TestComponent onSizeChange={(current) => (size = current)} />);

		act(() => {
			window.innerWidth = 640;
			window.dispatchEvent(new Event("resize"));
			window.innerHeight = 480;
			window.dispatchEvent(new Event("resize"));
		});

		expect(size).toEqual({ width: 640, height: 480 });
		expect(screen.getByTestId("size").textContent).toBe("640x480");
	});
});
