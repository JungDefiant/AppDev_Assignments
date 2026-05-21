class PatientLinkedListNode {
	constructor(patientInfo, last, next) {
		this.patientInfo = patientInfo;
		this.last = last;
		this.next = next;
	}
}

function mergeLinkedLists(a, b) {
	if (!b) {
		if (!a) {
			return null;
		} else {
			return a;
		}
	} else if (!a) {
		return b;
	}

	let currANode = a;
	let currBNode = b;
	let nextBNode = null;
	let head;
	while (currBNode) {
		if (currANode.patientInfo.ssn > currBNode.patientInfo.ssn) {
			nextBNode = currBNode.next;
			currBNode.last = currANode.last;
			currBNode.next = currANode;
			currANode.last = currBNode;
			if (currBNode.last) {
				currBNode.last.next = currBNode;
			}
			currBNode = nextBNode;
		} else if (!currANode.next) {
			currANode.next = currBNode;
			currBNode.last = currANode;
			break;
		} else {
			currANode = currANode.next;
		}
	}

	head = a.patientInfo.ssn <= b.patientInfo.ssn ? a : b;

	return head;
}

module.exports = {
	problem: mergeLinkedLists,
	node: PatientLinkedListNode,
};
