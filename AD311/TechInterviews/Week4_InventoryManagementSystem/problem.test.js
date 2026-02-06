const problem = require('./problem');

test('sorts inventory; single zero', () => {
     expect(problem([4,0,1,3])).toEqual([4,0,0,1]);
});

test('sorts inventory; three zeroes', () => {
     expect(problem([4,0,1,3,0,2,5,0])).toEqual([4,0,0,1,3,0,0,2]);
});

test('sorts inventory; five zeroes', () => {
     expect(problem([4,0,1,3,0,2,0,5,0,12,13])).toEqual([4,0,0,1,3,0,0,2,0,0,5]);
});

test('edge case: contiguous zeroes', () => {
     expect(problem([4,0,0,3,4])).toEqual([4,0,0,0,0]);
});

test('edge case: nothing out of stock', () => {
     expect(problem([3,2,1])).toEqual([3,2,1]);
});

test('edge case: all zeroes', () => {
     expect(problem([0,0,0,0,0])).toEqual([0,0,0,0,0]);
});
