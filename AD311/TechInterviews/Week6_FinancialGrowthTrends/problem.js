function problem(inputArr) {
  const outputArr = [];
  let i = 0;
  let j = inputArr.length - 1;
  while (outputArr.length < inputArr.length)
  {
    const num1 = inputArr[i] * inputArr[i];
    const num2 = inputArr[j] * inputArr[j];

    if (num1 > num2)
    {
      outputArr.unshift(num1);
      i++;
    }
    else
    {
      outputArr.unshift(num2);
      j--;
    }
  }

  return outputArr;

//   outputArr = []
//   i = 0
//   j = -1
//   while (outputArr.length < inputArr.length)
//     num1 = inputArr[i] * outputArr[i]
//   num2 = inputArr[j] * inputArr[j]
//   if (num1 > num2)
//     outputArr.prepend(num1)
//   i++
//  else
//   outputArr.prepend(num2)
//   j--
}

module.exports = problem;
