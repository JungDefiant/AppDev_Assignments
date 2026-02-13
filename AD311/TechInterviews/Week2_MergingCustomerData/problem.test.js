const problem = require('./problem');

test('test case 1', () => {
     expect(problem([101,104,107,0,0,0], 3, [102,105,108], 3)).toBe(3);
});

test('test case 2', () => {
     expect(problem([111,112,113,114,115,117], 5, [101,102,103,104], 2)).toBe(3);
});

test('test case 3', () => {
     expect(problem([111,0,113,0,115,117], 1, [101,102,103,104,105,106], 4)).toBe(3);
});

test('edge case: merge w/ 1 empty array', () => {
     expect(problem([103], 1, [], 0)).toBe([103]);
});

test('edge case: merge w/ both empty arrays', () => {
     expect(problem([], 0, [], 0)).toBe([]);
});

test('edge case: merge out of bounds', () => {
     expect(problem([111,0,113,0], 5, [102,105,108], 3)).toBe([103]);
});
