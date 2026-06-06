import React, { useState } from "react";
import { afterEach, describe, expect, test } from "vitest";
import { createRoot } from "react-dom/client";
import useLocalStorage from "./useLocalStorage";

function BasicHookTest({ storageKey, initialValue }) {
	const [value, setValue] = useLocalStorage(storageKey, initialValue);

	return (
		<div>
			<span data-testid="value">{value === null ? "null" : String(value)}</span>
			<button data-testid="update-button" onClick={() => setValue("updated")}>
				Update
			</button>
		</div>
	);
}

function KeyChangeHookTest({ initialKey, nextKey, initialValue }) {
	const [storageKey, setStorageKey] = useState(initialKey);
	const [value, setValue] = useLocalStorage(storageKey, initialValue);

	return (
		<div>
			<span data-testid="value">{value === null ? "null" : String(value)}</span>
			<button data-testid="switch-key" onClick={() => setStorageKey(nextKey)}>
				Switch Key
			</button>
			<button data-testid="update-button" onClick={() => setValue("changed")}>
				Change Value
			</button>
		</div>
	);
}

async function renderComponent(component) {
	const container = document.createElement("div");
	document.body.appendChild(container);
	const root = createRoot(container);

	root.render(component);
	await new Promise((resolve) => setTimeout(resolve, 20));

	return { container, root };
}

afterEach(() => {
	localStorage.clear();
	document.body.innerHTML = "";
});

describe("Tests", () => {
	test("Test: loads an existing value from localStorage", async () => {
		localStorage.setItem("name", "stored-value");

		await renderComponent(
			<BasicHookTest storageKey="name" initialValue="fallback" />,
		);

		expect(document.querySelector('[data-testid="value"]').textContent).toBe(
			"stored-value",
		);
		expect(localStorage.getItem("name")).toBe("stored-value");
	});

	test("Test: writes the initial value to localStorage when no entry exists", async () => {
		await renderComponent(
			<BasicHookTest storageKey="color" initialValue="blue" />,
		);

		expect(document.querySelector('[data-testid="value"]').textContent).toBe(
			"blue",
		);
		expect(localStorage.getItem("color")).toBe("blue");
	});

	test("Test: updates localStorage after state changes", async () => {
		await renderComponent(
			<BasicHookTest storageKey="count" initialValue="0" />,
		);

		const button = document.querySelector('[data-testid="update-button"]');
		button.click();
		await new Promise((resolve) => setTimeout(resolve, 20));

		expect(localStorage.getItem("count")).toBe("updated");
		expect(document.querySelector('[data-testid="value"]').textContent).toBe(
			"updated",
		);
	});

	test("Edge Case: defaults to an empty string when no initial value is provided", async () => {
		await renderComponent(<BasicHookTest storageKey="empty-default" />);

		expect(document.querySelector('[data-testid="value"]').textContent).toBe(
			"",
		);
		expect(localStorage.getItem("empty-default")).toBe("");
	});

	test("Edge Case: preserves an empty string stored in localStorage instead of falling back", async () => {
		localStorage.setItem("stored-empty", "");

		await renderComponent(
			<BasicHookTest storageKey="stored-empty" initialValue="fallback" />,
		);

		expect(document.querySelector('[data-testid="value"]').textContent).toBe(
			"",
		);
		expect(localStorage.getItem("stored-empty")).toBe("");
	});

	test("Edge Case: writes the current value to the new key when the storage key changes", async () => {
		await renderComponent(
			<KeyChangeHookTest
				initialKey="first-key"
				nextKey="second-key"
				initialValue="start"
			/>,
		);

		const updateButton = document.querySelector(
			'[data-testid="update-button"]',
		);
		updateButton.click();
		await new Promise((resolve) => setTimeout(resolve, 20));

		expect(localStorage.getItem("first-key")).toBe("changed");

		const switchButton = document.querySelector('[data-testid="switch-key"]');
		switchButton.click();
		await new Promise((resolve) => setTimeout(resolve, 20));

		expect(localStorage.getItem("second-key")).toBe("changed");
		expect(localStorage.getItem("first-key")).toBe("changed");
	});
});
