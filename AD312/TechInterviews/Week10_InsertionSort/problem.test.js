const { randomInt } = require("crypto");
const InsertionSort = require("./problem");

test("small array", () => {
	const arr = [3, 6, 2, 7, 4];
	InsertionSort(arr);
	expect(arr).toEqual([2, 3, 4, 6, 7]);
});

test("large array", () => {
	const arr = [
		5, 8, 16, 4, 15, 3, 12, 1, 11, 19, 17, 6, 20, 7, 9, 14, 10, 18, 2, 13,
	];
	InsertionSort(arr);

	expect(arr).toEqual([
		1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
	]);
});

test("random array", () => {
	const randArr = Array.from({ length: 4 }, () => randomInt(10));
	InsertionSort(randArr);

	expect(randArr[0] <= randArr[1]).toBe(true);
	expect(randArr[1] <= randArr[2]).toBe(true);
	expect(randArr[2] <= randArr[3]).toBe(true);
});

test("sorted array, ascending", () => {
	const arr = [1, 2, 3, 3, 4, 5];
	InsertionSort(arr);

	expect(arr).toEqual([1, 2, 3, 3, 4, 5]);
});

test("sorted array, descending", () => {
	const arr = [5, 4, 3, 2, 1];
	InsertionSort(arr);

	expect(arr).toEqual([1, 2, 3, 4, 5]);
});

test("nearly sorted array", () => {
	const arr = [1, 2, 3, 4, 3, 6, 5];
	InsertionSort(arr);

	expect(arr).toEqual([1, 2, 3, 3, 4, 5, 6]);
});
