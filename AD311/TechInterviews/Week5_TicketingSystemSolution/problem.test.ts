const { TicketingSystem, Ticket } = require('./problem');

describe('ticketing system', () => {
     test('test case 1', () => {
          let TicketTest = new TicketingSystem();
          TicketTest.generateTickets(3);
          let output = TicketTest.processTickets();
          expect(output).toEqual([1,2,3]);
     });

     test('test case 2', () => {
          let TicketTest = new TicketingSystem();
          TicketTest.generateTickets(3000);
          let output = TicketTest.processTickets();
          expect(output.length).toEqual(3000);;
     });

     test('test case 3', () => {
          let TicketTest = new TicketingSystem();
          TicketTest.generateTickets(1);
          let output = TicketTest.processTickets();
          expect(output).toEqual([1]);
     });

     test('edge case: no tickets processed', () => {
          let TicketTest = new TicketingSystem();
          TicketTest.generateTickets(0);
          let output = TicketTest.processTickets();
          expect(output).toEqual([]);
     });

     test('edge case: ticket numbers below 1', () => {
          let TicketTest = new TicketingSystem();
          TicketTest.ticketQueue.push(
               new Ticket(-2, 100),
               new Ticket(-1, 100),
               new Ticket(0, 150),
               new Ticket(3, 200),
          );
          let output = TicketTest.processTickets();
          expect(output).toEqual([3]);
     });

     test('edge case: duplicate tickets processed', () => {
          let TicketTest = new TicketingSystem();
          TicketTest.ticketQueue.push(
               new Ticket(1, 100),
               new Ticket(1, 100),
               new Ticket(2, 150),
               new Ticket(3, 200),
          );
          let output = TicketTest.processTickets();
          expect(output).toEqual([1,2,3]);
     });
});

