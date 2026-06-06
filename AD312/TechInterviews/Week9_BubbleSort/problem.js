function bubbleSort(a) {
	// Runs for the entire array
	for (let i = 0; i < a.length; i++) {
		// Each pass runs from the start of the array to the index
		// before the sorted part of the array
		for (let j = 0; j < a.length - 1; j++) {
			// If next index has a value less than current index,
			// then swap the values of both indices.
			if (a[j + 1] < a[j]) {
				swap = true;
				const temp = a[j];
				a[j] = a[j + 1];
				a[j + 1] = temp;
			}
		}
	}
}

function optimizedBubbleSort(a) {
	let sorted = false;
	let passes = 0;

	// Runs until there is no swap in a pass
	while (!sorted) {
		let swap = false;
		// Each pass runs from the start of the array to the index
		// before the sorted part of the array
		for (let i = 0; i < a.length - passes - 1; i++) {
			// If next index has a value less than current index,
			// then swap the values of both indices.
			if (a[i + 1] < a[i]) {
				swap = true;
				const temp = a[i];
				a[i] = a[i + 1];
				a[i + 1] = temp;
			}
		}

		// Sorted is false if a swap occurred in this pass
		sorted = !swap;

		// Increment number of passes, indicating the number
		// of sorted values in the array
		passes++;
	}
}

module.exports = { problem: bubbleSort, optProblem: optimizedBubbleSort };
