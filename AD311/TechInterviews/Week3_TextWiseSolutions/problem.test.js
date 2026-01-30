const stringReversal = require('./problem');

test('reverse the word "make"', () => {
     expect(stringReversal("make")).toBe("ekam");
});

test('reverse the word "application"', () => {
     expect(stringReversal("application")).toBe("noitacilppa");
});

test('reverse the word "javascript"', () => {
     expect(stringReversal("javascript")).toBe("tpircsavaj");
});

test('reverse a palindrome', () => {
     expect(stringReversal("radar")).toBe("radar");
});

test('reverse a word with repeating letters', () => {
     expect(stringReversal("aardvaark")).toBe("kraavdraa");
});

test('reverse a string with a space', () => {
     expect(stringReversal("hello world")).toBe("dlrow olleh");
});
