const { problem, node } = require("./problem");

// Standard Tests
test("test 1", () => {
	const list = new node(
		2,
		new node(3, new node(1, new node(3, new node(2, null)))),
	);
	expect(problem(list)).toBe(true);
});

test("test 2", () => {
	const list = new node(
		2,
		new node(3, new node(1, new node(1, new node(3, new node(2, null))))),
	);
	expect(problem(list)).toBe(true);
});

test("test 3", () => {
	const list = new node(
		11,
		new node(12, new node(13, new node(12, new node(12, new node(11, null))))),
	);
	expect(problem(list)).toBe(false);
});

// Edge Cases
test("edge case: all the same number", () => {
	const list = new node(
		2,
		new node(2, new node(2, new node(2, new node(2, new node(2, null))))),
	);
	expect(problem(list)).toBe(true);
});

test("edge case: empty node", () => {
	const list = new node(2, null);
	expect(problem(list)).toBe(true);
});

test("edge case: null param", () => {
	expect(problem(null)).toBe(false);
});
