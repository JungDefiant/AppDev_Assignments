## Issue Logs

### Issue 1

- _Location:_ Line 12
- _Issue:_ Extra comma in ITEMS
- _Explanation:_ There is an extra comma with no preceding element in ITEMS. This will likely cause failures because properties of objects in the ITEMS array will be expected and not found.
- _Suggested Fix:_ Add an entry to ITEMS preceding the comma or delete the comma.
- _Status:_ Fixed

### Issue 2

- _Location:_ Line 17
- _Issue:_ Incorrect syntax for properties in object
- _Explanation:_ The syntax for initializing properties in the new item object is incorrect because it is written as "key" = value.
- _Suggested Fix:_ The proper way of initializing these object properties would be written as "key": value. In this context, the initialization would be written as { "name": name, "price": price }. This may also be shorthanded as { name, price }.
- _Status:_ Fixed

### Issue 3

- _Location:_ Line 22
- _Issue:_ Type mismatch when calling indexOf()
- _Explanation:_ indexOf() expects an object with the properties name (string) and price (number), but instead a string if provided on line 22. Furthermore, name is passed as a value "name", when the parameter should be passed in.
- _Suggested Fix:_ Use findIndex() to find an object with the matching name, instead of using indexOf(). Pass name as the parameter, not a string value called "name".
- _Status:_ Fixed


### Issue 4

- _Location:_ Line 28
- _Issue:_ Magic number
- _Explanation:_ The for loop on line 28 uses the magic number "3". This can create issues with readability and performing changes on the code in the future.
- _Suggested Fix:_ Create a new const with the value of the magic number. Replace the "3" with the const.
- _Status:_ Fixed

### Issue 5

- _Location:_ Line 29
- _Issue:_ Variable total is not declared with a type
- _Explanation:_ "total" is not typed, so the compiler confuses the variable with the function named total.
- _Suggested Fix:_ Declare total as a const.
- _Status:_ Fixed

### Issue 6

- _Location:_ Line 35
- _Issue:_ Operator error
- _Explanation:_ Due to total returning itself (see issue 5), the compiler is flagging an operator error
- _Suggested Fix:_ Complete fix for issue 5.
- _Status:_ Fixed

### Issue 7

- _Location:_ Line 49
- _Issue:_ Enclosing ` is missing
- _Explanation:_ The ` mark to enclose this comment is missing.
- _Suggested Fix:_ Enclose the comment with the ` mark.
- _Status:_ Fixed

### Issue 8

- _Location:_ Line 49
- _Issue:_ Param type mismatch
- _Explanation:_ A string is passed into tax() when the parameter only accepts a number.
- _Suggested Fix:_ Moving the String() call outside of the tax() param and call String(tax(taxRate)).
- _Status:_ Fixed

### Issue 9

- _Location:_ Line 22
- _Issue:_  idx is not used
- _Explanation:_ The idx variable is instantiated, but never used in the deleteItem().
- _Suggested Fix:_ Replace line 23 with a line that deletes the element of the ITEMS array at the index matching idx.
- _Status:_ Fixed

### Issue 10

- _Location:_ Line 42, 43
- _Issue:_  console.log was not printing the actual item information
- _Explanation:_ The console.log is intended to print the name and price properties of every item in the ITEMS array, but it doesn't for two reasons. The first reason is it wasn't formatted as a template literal, so the ${} were ignored. The second reason is the for loop was formatted to get every element of the ITEMS array as variable i, but i was used as an index on line 42.
- _Suggested Fix:_ Change line 42 to a template literal that prints the information of the item directly. Use i (rename to item for readability) itself, not as an index.
- _Status:_ Fixed

## Errors, Defects, Failures, and Root Causes
The examples given below refer to line 22 of receipt.ts.

### Error

An example of an error is the incorrect choice of passing a string value into the indexOf() function at line 22.

### Defect

An example of a defect is passing a string value into the indexOf() function, which requires an object with { name: string, price: number }.

### Root Cause

An example of a root cause is a misunderstanding of how to pass parameters into a function. When the value "name" is passed instead of the parameter name, this demonstrates a misunderstanding of the difference between a value and a variable name. Another root cause is a misunderstanding of what type of input is needed by the indexOf() function in this context; an object is required, not a string.

### Failure

An example of a failure is that the index of the object being searched for to delete in the deleteItem() function is not found.
