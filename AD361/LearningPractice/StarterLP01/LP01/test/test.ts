import { test, expect } from "@jest/globals";
import { isEven, palindrome, countVowels } from "../src/functions";

test("isEven", () => {
	expect(isEven(2)).toEqual(true);
	expect(isEven(1)).toEqual(false);
});

test("palindrome", () => {
	expect(palindrome("radar")).toEqual(true);
	expect(palindrome("cat")).toEqual(false);
	expect(palindrome("catac")).toEqual(false);
});

test("countVowels", () => {
	expect(countVowels("superman")).toEqual(3);
	expect(countVowels("sprmn")).toEqual(0);
});
