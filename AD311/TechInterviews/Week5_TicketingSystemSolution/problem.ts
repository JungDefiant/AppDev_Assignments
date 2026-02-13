class TicketingSystem
{
  public ticketQueue: Array<Ticket> = [];
  lastTimeStamp: number = 0;
  lastTicketNumber: number = 0;
  readonly timeStampInterval: number = 1000;

  generateTickets(numTickets: number)
  {
    for (let i = 1; i <= numTickets; i++) {
      const newDate = new Date(Math.random() * this.timeStampInterval);
      const newTimeStamp = this.lastTimeStamp + newDate.getMilliseconds();
      const newTicketNumber = this.lastTicketNumber + 1;
      
      const newTicket = new Ticket(newTicketNumber, newTimeStamp);
      this.ticketQueue.push(newTicket);

      this.lastTimeStamp = newTimeStamp;
      this.lastTicketNumber = newTicketNumber;
    }
  }

  processTickets() : number[]
  {
    const processOutput: number[] = [];
    const duplicateCheck: Set<number> = new Set();
    while (this.ticketQueue.length > 0)
    {
      const ticket = this.ticketQueue.shift();
      
      if(!ticket || ticket?.ticketNumber < 1 || duplicateCheck.has(ticket.ticketNumber))
      {
        continue;
      }

      const newOutput = `PROCESSED TICKET: ${ticket?.ticketNumber}, Time: ${ticket?.timeStamp}`;
      console.log(newOutput);
      processOutput.push(ticket?.ticketNumber || -1);
      duplicateCheck.add(ticket.ticketNumber);
    }

    return processOutput;
  }
}

class Ticket
{
  ticketNumber: number = -1;
  timeStamp: number = -1;

  constructor (newTicketNum: number, newTimeStamp: number)
  {
    this.ticketNumber = newTicketNum;
    this.timeStamp = newTimeStamp;
  }
}

module.exports = { TicketingSystem, Ticket };

