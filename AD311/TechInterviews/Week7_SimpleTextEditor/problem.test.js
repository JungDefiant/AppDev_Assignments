const TextOperation = require('./problem');
const mockStdin  = require('mock-stdin');

describe('test suite', () => {
     let stdin;
     let textOp;

     beforeEach(() => {
          // Start mocking stdin before each test
          stdin = mockStdin.stdin(); 
          textOp = new TextOperation(stdin);
          // Mock console.log to capture output
          jest.spyOn(console, 'log').mockImplementation(() => {});
     });

     afterEach(() => {
          // Restore original stdin after each test
          stdin.restore();
          console.log.mockRestore();
     });

     it('test 1: add', (done) => {
          const expectedResult = "aaa";
          const expectedCalls = 3;
          
          textOp.add('a');
          textOp.add('a');
          textOp.add('a');

          const consoleLogLength = console.log.mock.calls.length;

          expect(console.log.mock.calls[consoleLogLength-1][0]).toBe(expectedResult);
          expect(consoleLogLength).toBe(expectedCalls);
          done();
     });

     it('test 2: add and delete', (done) => {
          const expectedResult = "aaa";
          const expectedCalls = 5;
          
          textOp.add('a');
          textOp.add('a');
          textOp.add('a');
          textOp.add('a');
          textOp.delete();

          const consoleLogLength = console.log.mock.calls.length;

          expect(console.log.mock.calls[consoleLogLength-1][0]).toBe(expectedResult);
          expect(consoleLogLength).toBe(expectedCalls);
          done();
     });

     it('test 3: add, delete, and undo', (done) => {
          const expectedResult = "aaa";
          const expectedCalls = 7;
          
          textOp.add('a');
          textOp.add('a');
          textOp.add('a');
          textOp.add('a');
          textOp.delete();
          textOp.delete();
          textOp.undo();

          const consoleLogLength = console.log.mock.calls.length;

          expect(console.log.mock.calls[consoleLogLength-1][0]).toBe(expectedResult);
          expect(consoleLogLength).toBe(expectedCalls);
          done();
     });

     it('edge case 1: delete with no text', (done) => {
          const expectedResult = "";
          
          textOp.delete('a');

          const consoleLogLength = console.log.mock.calls.length;

          expect(console.log.mock.calls[consoleLogLength-1][0]).toBe(expectedResult);
          done();
     });

     it('edge case 2: undo with no text', (done) => {
          const expectedResult = "";
          
          textOp.undo();

          const consoleLogLength = console.log.mock.calls.length;

          expect(console.log.mock.calls[consoleLogLength-1][0]).toBe(expectedResult);
          done();
     });

     it('edge case 3: undo all operations', (done) => {
          const expectedResult = "";
          
          textOp.add('a');
          textOp.add('a');
          textOp.add('a');
          textOp.add('a');
          textOp.delete();
          textOp.delete();
          textOp.undo();
          textOp.undo();
          textOp.undo();
          textOp.undo();
          textOp.undo();
          textOp.undo();

          const consoleLogLength = console.log.mock.calls.length;

          expect(console.log.mock.calls[consoleLogLength-1][0]).toBe(expectedResult);
          done();
     });
});
