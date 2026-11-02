const {fiveStarCount} = require('./main');

// Statement coverage
describe("Statement coverage", () => {
     it("Single rating", () => {
          expect(fiveStarCount([5])).toBe(1);
     });
})

// Branch coverage
describe("Branch coverage", () => {
     it("Branch 1 - takes if branch", () => {
          expect(fiveStarCount([5])).toBe(1);
     });

     it("Branch 2 - skips if branch", () => {
          expect(fiveStarCount([])).toBe(0);
     });

     it("Branch 3 - both branches", () => {
          expect(fiveStarCount([1, 5])).toBe(1);
     });
})

// Path coverage
describe("Path coverage", () => {
     it("Path 1 - no trips", () => {
          expect(fiveStarCount([])).toBe(0);
     });

     it("Path 2 - [true]", () => {
          expect(fiveStarCount([5])).toBe(1);
     });

     it("Path 3 - [false]", () => {
          expect(fiveStarCount([1])).toBe(0);
     });

     it("Path 4 - [true] -> [false]", () => {
          expect(fiveStarCount([5, 1])).toBe(1);
     });

     it("Path 5 - [false] -> [true]", () => {
          expect(fiveStarCount([1, 5])).toBe(1);
     });

     it("Path 6 - [true] -> [true]", () => {
          expect(fiveStarCount([5, 5])).toBe(2);
     });

     it("Path 7 - [false] -> [false]", () => {
          expect(fiveStarCount([1, 3])).toBe(0);
     });
})
