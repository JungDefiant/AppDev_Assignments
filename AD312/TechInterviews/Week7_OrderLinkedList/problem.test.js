const { node, order } = require("./problem");

test("test 1: reverse()", () => {
	const head = new node(
		new order(1),
		new node(new order(2), new node(new order(3), null)),
	);

	const newHead = head.reverse();

	expect(newHead.order.orderID).toEqual(3);
	expect(newHead.next).not.toBeNull();
	expect(newHead.display()).toBe("[3][2][1]");
	expect(head.next).toBeNull();
});

test("test 2: append()", () => {
	const head = new node(
		new order(1),
		new node(new order(2), new node(new order(3), null)),
	);

	const newNode = new node(new order(4), null);

	head.append(newNode);

	expect(head.display()).toBe("[1][2][3][4]");
});

test("test 3: display()", () => {
	const head = new node(
		new order(1),
		new node(new order(2), new node(new order(3), null)),
	);

	expect(head.display()).toBe("[1][2][3]");
});

test("edge case 1: reverse() with one node", () => {
	const head = new node(new order(1), null);

	const newHead = head.reverse();

	expect(newHead.order.orderID).toEqual(1);
	expect(newHead.display()).toBe("[1]");
	expect(head.next).toBeNull();
});

test("edge case 2: append() with no order", () => {
	const head = new node(new order(1), null);

	const newNode = new node(null, null);

	head.append(newNode);

	expect(head.display()).toBe("[1]");
});

test("edge case 3: display() with null orders", () => {
	const head = new node(null, new node(null, new node(null, null)));

	expect(head.display()).toBe("");
});
