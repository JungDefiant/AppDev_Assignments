const problem = require('./problem');

test('test case 1', () => {
     expect(problem([101,104,107,0,0,0], 3, [102,105,108], 3)).toEqual([101,102,104,105,107,108]);
});

test('test case 2', () => {
     expect(problem([103], 1, [], 0)).toEqual([103]);
});

test('test case 1', () => {
     expect(problem([101,104,107,200,2000,0,0,0], 2, [102,105,108], 1)).toEqual([101,102,104]);
});

test('edge case 1: n is larger than the data2', () => {
     expect(problem([101,104,107,0,0,0], 3, [102,105,108], 6)).toEqual([101,102,104,105,107,108,0,0,0]);
});

test('edge case 2: m is larger than the data1', () => {
     expect(problem([101,104,107,0,0,0], 10, [102,105,108], 3)).toEqual([101,102,104,105,107,108,0,0,0,0,0,0,0]);
});

test('edge case 3: both arrays are empty, but m and n are greater than 0', () => {
     expect(problem([], 5, [], 5)).toEqual([0,0,0,0,0,0,0,0,0,0]);
});
