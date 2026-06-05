function bubbleSort(a) {
	let sorted = false;
	let pass = 1;
	while (!sorted) {
		let swap = false;
		let temp = a[0];
		for (let i = 1; i < a.length - 1; i++) {
			if (a[i + 1] <= temp) {
				swap = true;
				a[i] = a[i + 1];
				a[i + 1] = temp;
			}

			temp = a[i + 1];
		}

		sorted = !swap;

		console.log(`PASS ${pass}`, a);
		pass += 1;
	}
}

module.exports = selectionSort;
