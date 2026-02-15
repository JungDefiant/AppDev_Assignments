function problem(data1, m, data2, n) {
  const data2slice = data2.slice(0, n);
  let placeholder = null;

  for (let i = 0; i < data2slice.length; i++) {
    const data2EL = data2slice[i];
    let placedData2EL = false;

    for (let j = 0; j < data1.length; j++) {
      const data1EL = data1[j];

      if ((data2EL < data1EL || data1EL == 0) && !placedData2EL) {
        placeholder = data1EL;
        data1[j] = data2EL;
        placedData2EL = true;
      }
      else if (placeholder && (placeholder < data1EL || data1EL == 0)) {
        let newph = data1[j];
        data1[j] = placeholder;
        placeholder = newph;
      }

    }

    placeholder = null;
  }

  if (data1.length > m + n) {
    let data1length = data1.length;
    for (let i = data1length - 1; i > m + n - 1; i--) {
      data1.pop();
    }
  }
  else if (data1.length < m + n) {
    let data1length = data1.length;
    for (let i = 0; i < (m + n) - data1length; i++) {
      data1.push(0);
    }
  }

  return data1;
}

module.exports = problem;
