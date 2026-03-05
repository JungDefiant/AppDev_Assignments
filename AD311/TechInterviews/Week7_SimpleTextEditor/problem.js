const readline = require('readline');

// Enable keypress events on standard input
readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

class TextOperation
{
  operationStack = [];
  text = [];
  stdin;

  constructor(_stdin)
  {
    this.stdin = _stdin;
    this.stdin.on('keypress', (str, key) => {
      const keyPressed = key.name;
      console.log(keyPressed);
      if (keyPressed == "backspace")
      {
        this.delete();
      }
      else if (keyPressed == "z" && key.ctrl)
      {
        this.undo();
      }
      else if (keyPressed == "c" && key.ctrl)
      {
        process.exit();
      }
      else {
        this.add(keyPressed);
      }
    });
  }

  add(keyPressed) {
    this.text.push(keyPressed);
    console.log(this.text.toLocaleString().replace(/[,]/g, ""));
    this.operationStack.push({
      id: "add",
      char: keyPressed,
      undo: (oper, text) => {
        text.pop();
      }
    });
  }

  delete() 
  {
    const lastChar = this.text.pop();
    console.log(this.text.toLocaleString().replace(/[,]/g, ""));
    const operation = {
      id: "delete",
      char: lastChar,
      undo: (oper, text) => {
        text.push(oper.char);
      }
    };
    this.operationStack.push(operation);
  }

  undo()
  {
    const lastOperation = this.operationStack.pop();
    if(lastOperation) {
      lastOperation.undo(lastOperation, this.text);
    }
    console.log(this.text.toLocaleString().replace(/[,]/g, ""));
  }
}

module.exports = TextOperation;
