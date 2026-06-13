function insertionSort(arr) {
	for (let i = 0; i < arr.length; i++) {
		const nextElToSort = arr[i];

		for (let j = i + 1; j > 0; j--) {
			const nextElToCheck = arr[j];

			if (nextElToCheck < arr[j - 1]) {
				const swap = arr[j - 1];
				arr[j - 1] = nextElToCheck;
				arr[j] = swap;
			} else {
				break;
			}
		}

		console.log(`STEP ${i + 1}`, arr);
	}
}

function insertionSortObjects(arr) {
	for (let i = 0; i < arr.length; i++) {
		const nextElToSort = arr[i];

		for (let j = i + 1; j > 0; j--) {
			const nextElToCheck = arr[j];
			console.log(nextElToCheck);

			if (!nextElToCheck) {
				continue;
			}

			if (nextElToCheck.id < arr[j - 1].id) {
				const swap = arr[j - 1];
				arr[j - 1] = nextElToCheck;
				arr[j] = swap;
			} else {
				break;
			}
		}
	}
}

module.exports = {
	insertionSort,
	insertionSortObjects,
};
