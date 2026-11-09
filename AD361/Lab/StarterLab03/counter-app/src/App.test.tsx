import { fireEvent, render, screen } from "@testing-library/react"
import App from "./App";

describe("Starting State", () => {
    it("Count is 0", () => {
        render(<App />);
        const countElement = screen.getByRole("heading", { name: "Count: 0" });
        expect(countElement).not.toBeNull();
    })

    it("Increment button appears", () => {
        render(<App />);
        const buttonElements = screen.getByRole("button", { name: "Increment" });
        expect(buttonElements).not.toBeNull();
    })

    it("Decrement button appears", () => {
        render(<App />);
        const buttonElements = screen.getByRole("button", { name: "Decrement" });
        expect(buttonElements).not.toBeNull();
    })

    it("Reset button appears", () => {
        render(<App />);
        const buttonElements = screen.getByRole("button", { name: "Reset" });
        expect(buttonElements).not.toBeNull();
    })
})

describe("State Mutations", () => {
    it("Increment changes the count from `0` to `1`", () => {
        render(<App />);
        const incrementButton = screen.getByRole("button", { name: "Increment" });
        if (incrementButton) {
            fireEvent.click(incrementButton, "onclick");
        }
        const count = screen.getByRole("heading", { name: "Count: 1" })
        expect(count).not.toBeNull();
    })

    it("Decrement changes the count from `0` to `-1`", () => {
        render(<App />);
        const incrementButton = screen.getByRole("button", { name: "Decrement" });
        if (incrementButton) {
            fireEvent.click(incrementButton, "onclick");
        }
        const count = screen.getByRole("heading", { name: "Count: -1" })
        expect(count).not.toBeNull();
    })

    it("Reset changes the count back to `0`", () => {
        render(<App />);
        const incrementButton = screen.getByRole("button", { name: "Increment" });
        if (incrementButton) {
            fireEvent.click(incrementButton, "onclick");
        }
        let count = screen.getByRole("heading", { name: "Count: 1" })
        expect(count).not.toBeNull();
        const resetButton = screen.getByRole("button", { name: "Reset" });
        if (resetButton) {
            fireEvent.click(resetButton, "onclick");
        }
        count = screen.getByRole("heading", { name: "Count: 0" })
        expect(count).not.toBeNull();
    })

    it("Increment changes the count from `0` to `100`", () => {
        render(<App />);
        const incrementButton = screen.getByRole("button", { name: "Increment" });
        if (incrementButton) {
            for (let i = 0; i < 100; i++) {
                fireEvent.click(incrementButton, "onclick");
            }
        }
        const count = screen.getByRole("heading", { name: "Count: 100" })
        expect(count).not.toBeNull();
    })
})
