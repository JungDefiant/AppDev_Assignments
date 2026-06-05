const { randomInt } = require("crypto");
const problem = require("./problem");

test("random ints", () => {
	const randArr = Array.from({ length: 4 }, () => randomInt(10));
	problem(randArr);

	expect(randArr[0] <= randArr[1]).toBe(true);
	expect(randArr[1] <= randArr[2]).toBe(true);
	expect(randArr[2] <= randArr[3]).toBe(true);
});

test("sorted array, ascending", () => {
	const arr = [1, 2, 3, 3, 4, 5];
	problem(arr);

	expect(arr[0] <= arr[1]).toBe(true);
	expect(arr[1] <= arr[2]).toBe(true);
	expect(arr[2] <= arr[3]).toBe(true);
	expect(arr[3] <= arr[4]).toBe(true);
	expect(arr[4] <= arr[5]).toBe(true);
});

test("sorted array, descending", () => {
	const arr = [5, 4, 3, 2, 1];
	problem(arr);

	expect(arr[0] <= arr[1]).toBe(true);
	expect(arr[1] <= arr[2]).toBe(true);
	expect(arr[2] <= arr[3]).toBe(true);
	expect(arr[3] <= arr[4]).toBe(true);
});

test("array of same numbers", () => {
	const arr = [2, 2, 2, 2, 2];
	problem(arr);

	expect(arr[0] <= arr[1]).toBe(true);
	expect(arr[1] <= arr[2]).toBe(true);
	expect(arr[2] <= arr[3]).toBe(true);
	expect(arr[3] <= arr[4]).toBe(true);
});

test("empty array", () => {
	const arr = [];
	problem(arr);

	expect(!arr[0]).toBe(true);
});

test("array of 1 number", () => {
	const arr = [2];
	problem(arr);

	expect(arr[0]).toEqual(2);
});
