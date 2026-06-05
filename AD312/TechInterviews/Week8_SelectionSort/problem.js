function selectionSort(a) {
	for (let i = 0; i < a.length; i++) {
		/* 
    Set the initial min to equal the leftmost unsorted
    index and cache the index of the initial min.
		*/
		let min = a[i];
		let minInd = i;
		for (let j = i + 1; j < a.length; j++) {
			/* 
      Track through the rest of the array to find a 
      number smaller than the min.
      If a smaller number is found, cache the new min
      and the index of the new min.
      */
			if (a[j] < min) {
				min = a[j];
				minInd = j;
			}
		}
		if (minInd !== i) {
			/*
      If the min index does not equal the current
      i, then switch the value in a[i] with the
      min value.
      */
			const temp = a[i];
			a[i] = min;
			a[minInd] = temp;
		}
	}
}

module.exports = selectionSort;
