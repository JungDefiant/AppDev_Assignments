const problem = require('./problem');

test('test 1', () => {
     expect(problem([-5, -2, 0, 3, 10])).toEqual([0, 4, 9, 25, 100]);
});

test('test 2', () => {
     expect(problem([-8, -3, 2, 4, 12])).toEqual([4, 9, 16, 64, 144]);
});

test('test 3', () => {
     expect(problem([-13, 7, 3, 6, 12])).toEqual([9, 36, 49, 144, 169]);
});

test('edge case 1: every number is the same', () => {
     expect(problem([3, 3, 3, 3, 3])).toEqual([9, 9, 9, 9, 9]);
});

test('edge case 2: every number is negative', () => {
     expect(problem([-10, -8, -6, -5, -1])).toEqual([1, 25, 36, 64, 100]);
});

test('edge case 3: empty array', () => {
     expect(problem([])).toEqual([]);
});
