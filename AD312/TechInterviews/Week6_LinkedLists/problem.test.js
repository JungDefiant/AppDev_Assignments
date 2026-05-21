const { problem, node } = require("./problem");

const createLinkedList = (arr) => {
	for (let i = 0; i < arr.length; i++) {
		const node = arr[i];
		const lastNode = arr[i - 1];
		const nextNode = arr[i + 1];

		if (lastNode) {
			node.last = lastNode;
		}

		if (nextNode) {
			node.next = nextNode;
		}
	}

	return arr[0];
};

const getSSNArrayFromLinkedList = (a) => {
	const arr = [];
	let node = a;
	while (node) {
		arr.push(node.patientInfo.ssn);
		node = node.next;
	}

	return arr;
};

test("test 1", () => {
	const a = createLinkedList([
		new node({ ssn: 0 }, null, null),
		new node({ ssn: 3 }, null, null),
	]);

	const b = createLinkedList([
		new node({ ssn: 0 }, null, null),
		new node({ ssn: 1 }, null, null),
		new node({ ssn: 2 }, null, null),
		new node({ ssn: 4 }, null, null),
		new node({ ssn: 5 }, null, null),
	]);

	const mergedList = problem(a, b);

	expect(getSSNArrayFromLinkedList(mergedList)).toEqual([0, 0, 1, 2, 3, 4, 5]);
});

test("test 2", () => {
	const a = createLinkedList([
		new node({ ssn: 1112223333 }, null, null),
		new node({ ssn: 1112223336 }, null, null),
		new node({ ssn: 1112223339 }, null, null),
		new node({ ssn: 1112223342 }, null, null),
	]);

	const b = createLinkedList([
		new node({ ssn: 1112223331 }, null, null),
		new node({ ssn: 1112223335 }, null, null),
		new node({ ssn: 1112223340 }, null, null),
		new node({ ssn: 1112223345 }, null, null),
	]);

	const mergedList = problem(a, b);

	expect(getSSNArrayFromLinkedList(mergedList)).toEqual([
		1112223331, 1112223333, 1112223335, 1112223336, 1112223339, 1112223340,
		1112223342, 1112223345,
	]);
});

test("test 3", () => {
	const a = createLinkedList([
		new node({ ssn: 25 }, null, null),
		new node({ ssn: 25 }, null, null),
		new node({ ssn: 25 }, null, null),
		new node({ ssn: 25 }, null, null),
	]);

	const b = createLinkedList([
		new node({ ssn: 21 }, null, null),
		new node({ ssn: 23 }, null, null),
		new node({ ssn: 25 }, null, null),
		new node({ ssn: 28 }, null, null),
	]);

	const mergedList = problem(a, b);

	expect(getSSNArrayFromLinkedList(mergedList)).toEqual([
		21, 23, 25, 25, 25, 25, 25, 28,
	]);
});

test("edge case: empty lists", () => {
	const a = createLinkedList([]);

	const b = createLinkedList([]);

	const mergedList = problem(a, b);

	expect(mergedList).toBe(null);
});

test("edge case: empty b list", () => {
	const a = createLinkedList([
		new node({ ssn: 0 }, null, null),
		new node({ ssn: 1 }, null, null),
		new node({ ssn: 2 }, null, null),
		new node({ ssn: 4 }, null, null),
		new node({ ssn: 5 }, null, null),
	]);

	const b = createLinkedList([]);

	const mergedList = problem(a, b);

	expect(getSSNArrayFromLinkedList(mergedList)).toEqual([0, 1, 2, 4, 5]);
});

test("edge case: empty a list", () => {
	const a = createLinkedList([]);

	const b = createLinkedList([
		new node({ ssn: 0 }, null, null),
		new node({ ssn: 1 }, null, null),
		new node({ ssn: 2 }, null, null),
		new node({ ssn: 4 }, null, null),
		new node({ ssn: 5 }, null, null),
	]);

	const mergedList = problem(a, b);

	expect(getSSNArrayFromLinkedList(mergedList)).toEqual([0, 1, 2, 4, 5]);
});
