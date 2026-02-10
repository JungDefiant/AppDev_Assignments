// Which keyword did you choose (const or let) to replace var?
// Why is this choice more appropriate than the other option?
// What would happen if you used the other keyword? Describe any potential issues or errors.

let fullName = "John Doe";
fullName = "Jane Doe";
console.log(fullName);
/*
This choice is more appropriate because fullName is reassigned. If I used const, then a TypeError would be thrown.
*/

const age = 30;
if (age > 18) {
  const adult = true;
  console.log(adult);
}
/*
A const for age and adult are more appropriate because neither are reassigned. If I used let, then it is possible
unexpected behavior to occur because age and adult can have their values changed.
*/

const loopArray = [];
for (let i = 0; i < 5; i++) {
  loopArray.push(i);
}
console.log(loopArray);
/*
A const for loopArray is more appopriate because loopArray is not reassigned, only manipulated. If I used const, then 
it is possible for all of the elements of loopArray to get lost because the contents would be overwritten.

A let for the i iterator in the for loop is more appropriate because i is incremented on each loop and only exists
within the scope of the for loop. If I used const, then a TypeError would be thrown.
*/

let MAXIMUM = 100;
MAXIMUM = 200;
/*
A let for MAXIMUM is more appopriate because MAXIMUM is reassigned. If I used const, then a TypeError would be thrown.
*/

let colors = ["Red", "Green", "Blue"];
colors = ["Yellow", "Pink", "Purple"];
console.log(colors);
/*
A let for colors is more appopriate because colors reassigned to equal a different array. If I used const, then a 
TypeError would be thrown when attempting to assign a new array.
*/
