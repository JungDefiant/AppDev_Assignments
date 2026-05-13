class LinkedListNode {
	constructor(metric, next) {
		this.metric = metric;
		this.next = next;
	}
}

function isHealthRecordSymmetric(root) {
	if (!root) {
		return false;
	}

	if (root.next === null) {
		return true;
	}

	let nextNode = root;
	let seekNode = root.next;
	let length = 1;
	while (seekNode !== null) {
		if (seekNode.next !== null) {
			length++;
		} else if (nextNode.metric != seekNode.metric) {
			return false;
		}

		seekNode = seekNode.next;
	}

	let i = 1;
	nextNode = root.next;
	seekNode = nextNode.next;
	while (nextNode !== null) {
		let j = length - i - 1;
		if (j < i) {
			break;
		}
		while (seekNode !== null) {
			if (j == i) {
				if (nextNode.metric !== seekNode.metric) {
					return false;
				}

				break;
			}

			seekNode = seekNode.next;
			j--;
		}
		i++;
		nextNode = nextNode.next;
		seekNode = nextNode.next;
	}

	return true;
}

module.exports = {
	problem: isHealthRecordSymmetric,
	node: LinkedListNode,
};
