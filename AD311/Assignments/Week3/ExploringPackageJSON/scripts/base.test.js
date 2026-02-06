const add = require("./add");
const subtract = require("./subtract");


test('adds 2 + 2 equals 4', () => {
     expect(add(2, 2)).toBe(4);
});

test('subtracts 5 - 3 equals 2', () => {
     expect(subtract(5, 3)).toBe(2);
});
