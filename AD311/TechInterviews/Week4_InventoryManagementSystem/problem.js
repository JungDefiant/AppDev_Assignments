function problem(arr) {
  let i = 0;
  while(i < arr.length) {
    if (arr[i] == 0)
    {
      let numstore = arr[i+1];
      let numstore2;
      for (let j = i+2; j < arr.length; j++) {
        // Move all elements to the right
        numstore2 = arr[j];
        arr[j] = numstore;
        numstore = numstore2;
      }

      if(arr.length > i+1)
      {
        arr[i+1] = 0;
      }

      i += 2;
    }
    else {
      i += 1;
    }
  }

  return arr;
}

module.exports = problem;
