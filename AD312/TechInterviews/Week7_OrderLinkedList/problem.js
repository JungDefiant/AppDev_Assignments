class Order {
	orderID;
	customerDetails;
	orderDetails;

	constructor(newOrderID) {
		this.orderID = newOrderID;
	}
}

class LLNode {
	next;
	order;

	constructor(newOrder, newNext) {
		this.next = newNext;
		this.order = newOrder;
	}

	append(newNode) {
		if (newNode.order === null) {
			return;
		}

		let currNode = this;
		while (currNode) {
			if (currNode.next === null) {
				currNode.next = newNode;
				break;
			} else {
				currNode = currNode.next;
			}
		}
	}

	display() {
		let currNode = this;
		let displayStr = "";
		while (currNode) {
			if (currNode.order === null) {
				return displayStr;
			}
			displayStr = displayStr.concat(`[${currNode.order.orderID}]`);
			currNode = currNode.next;
		}

		return displayStr;
	}

	reverse() {
		let nextNode = this.next;
		let currNode = this;
		while (nextNode) {
			let nextNextNode = nextNode.next;
			nextNode.next = currNode;
			if (currNode === this) {
				currNode.next = null;
			}

			currNode = nextNode;
			nextNode = nextNextNode;

			// [] -> []
			// [] <- []
		}

		this.display();

		return currNode;
	}
}

module.exports = {
	order: Order,
	node: LLNode,
};
