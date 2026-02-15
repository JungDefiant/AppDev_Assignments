const problem = require('./problem');

test('test case 1', () => {
     expect(problem(['lion', 'monkey', 'deer', 'snake', 'elephant'])).toBe(3);
});

test('test case 2', () => {
     expect(problem(['frog', 'horse', 'spider', 'ant'])).toBe(1);
});

test('test case 3', () => {
     expect(problem(['eagle', 'snake', 'spider', 'ant'])).toBe(0);
});

test('edge case 1: array of numbers', () => {
     expect(problem([1, 2, 3, 4])).toBe(0);
});

test('edge case 2: empty array', () => {
     expect(problem([])).toBe(0);
});

test('edge case 3: string parameter', () => {
     expect(problem('horse')).toBe(0);
});

