function InsertionSort(arr) {
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
	}
}

module.exports = InsertionSort;
