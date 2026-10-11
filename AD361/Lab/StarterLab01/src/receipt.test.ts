const { test, expect } = require("@jest/globals");
const { tax } = require("./fixed_receipt");

const SAMPLE_ITEM_TOTAL = 47.49;

test("Happy path test", () => {
	const taxRate = 0.75;
	const totalWithTax = tax(taxRate);
	expect(totalWithTax).toEqual(SAMPLE_ITEM_TOTAL + taxRate);
});

test("Unhappy-path test", () => {
	expect(tax(-1)).toBeNull();
});

test("Edge-case test", () => {
	const taxRate = 999;
	const totalWithTax = tax(taxRate);
	expect(totalWithTax).toEqual(SAMPLE_ITEM_TOTAL + taxRate);
});
