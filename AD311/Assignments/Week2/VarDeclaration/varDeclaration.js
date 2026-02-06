// Which keyword did you choose (const or let) to replace var?
// Why is this choice more appropriate than the other option?
// What would happen if you used the other keyword? Describe any potential issues or errors.

let fullName = "John Doe";
fullName = "Jane Doe";
console.log(fullName);
/*

*/

const age = 30;
if (age > 18) {
  const adult = true;
  console.log(adult);
}
/*

*/

const loopArray = [];
for (let i = 0; i < 5; i++) {
  loopArray.push(i);
}
console.log(loopArray);
/*

*/

let MAXIMUM = 100;
MAXIMUM = 200;
/*

*/

let colors = ["Red", "Green", "Blue"];
colors = ["Yellow", "Pink", "Purple"];
console.log(colors);
/*

*/
