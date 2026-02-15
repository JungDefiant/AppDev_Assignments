const fourLegs = ['lion', 'deer', 'elephant', 'horse', 'dog', 'cat'];

function problem(animalArr) {
  let count = 0;
  const fourLegsSet = new Set(fourLegs);

  for (let i = 0; i < animalArr.length; i++) {
    const element = animalArr[i];
    if(fourLegsSet.has(element))
    {
      count++;
    }
  }

  return count;
}

module.exports = problem;
