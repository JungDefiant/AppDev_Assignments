const { randomInt } = require("crypto");
const { insertionSort, insertionSortObjects } = require("./problem");

test("small array", () => {
	const arr = [3, 6, 2, 7, 4];
	insertionSort(arr);
	expect(arr).toEqual([2, 3, 4, 6, 7]);
});

test("large array", () => {
	const arr = [
		5, 8, 16, 4, 15, 3, 12, 1, 11, 19, 17, 6, 20, 7, 9, 14, 10, 18, 2, 13,
	];
	insertionSort(arr);

	expect(arr).toEqual([
		1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
	]);
});

test("sorted array, ascending", () => {
	const arr = [1, 2, 3, 3, 4, 5];
	insertionSort(arr);

	expect(arr).toEqual([1, 2, 3, 3, 4, 5]);
});

test("sorted array, descending", () => {
	const arr = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
	insertionSort(arr);

	for (let i = 0; i < arr.length - 1; i++) {
		expect(arr[i] <= arr[i + 1]).toBe(true);
	}
});

test("nearly sorted array", () => {
	const arr = [1, 2, 3, 4, 3, 6, 5, 7, 9, 8];
	insertionSort(arr);

	for (let i = 0; i < arr.length - 1; i++) {
		expect(arr[i] <= arr[i + 1]).toBe(true);
	}
});

test("random array 1", () => {
	const randArr = Array.from({ length: 5 }, () => randomInt(10));
	insertionSort(randArr);

	for (let i = 0; i < randArr.length - 1; i++) {
		expect(randArr[i] <= randArr[i + 1]).toBe(true);
	}
});

test("random array 2", () => {
	const randArr = Array.from({ length: 10 }, () => randomInt(10));
	insertionSort(randArr);

	for (let i = 0; i < randArr.length - 1; i++) {
		expect(randArr[i] <= randArr[i + 1]).toBe(true);
	}
});

test("random array 3", () => {
	const randArr = Array.from({ length: 50 }, () => randomInt(10));
	insertionSort(randArr);

	for (let i = 0; i < randArr.length - 1; i++) {
		expect(randArr[i] <= randArr[i + 1]).toBe(true);
	}
});

test("random array 4", () => {
	const randArr = Array.from({ length: 100 }, () => randomInt(10));
	insertionSort(randArr);

	for (let i = 0; i < randArr.length - 1; i++) {
		expect(randArr[i] <= randArr[i + 1]).toBe(true);
	}
});

test("random array 5", () => {
	const randArr = Array.from({ length: 1000 }, () => randomInt(10));
	insertionSort(randArr);

	for (let i = 0; i < randArr.length - 1; i++) {
		expect(randArr[i] <= randArr[i + 1]).toBe(true);
	}
});

test("stability test", () => {
	const arr = [
		{ id: 1, content: "Apple" },
		{ id: 2, content: "Banana" },
		{ id: 3, content: "Apple" },
		{ id: 6, content: "Apple" },
		{ id: 4, content: "Apple" },
		{ id: 3, content: "Banana" },
		{ id: 5, content: "Banana" },
	];
	insertionSortObjects(arr);

	for (let i = 0; i < arr.length - 1; i++) {
		expect(arr[i].id <= arr[i + 1].id).toBe(true);
	}
});
