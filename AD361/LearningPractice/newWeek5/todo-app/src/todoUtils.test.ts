import { addTodo, countDone, createTodo } from "./todoUtils"


describe("Statement coverage", () => {
    it("Call createToDo directly", () => {
        const toDoEntry = createTodo("Buy olive oil");
        expect(toDoEntry.text).toBe("Buy olive oil");
        expect(toDoEntry.done).toBe(false);
        expect(typeof toDoEntry.id).toBe("number");
    });
})

describe("Branch coverage", () => {
    it("Whitespace input", () => {
        const toDoList = [{ id: Date.now(), text: "Feed cat", done: true }]
        expect(toDoList.length).toEqual(1);
        const addToDoResult = addTodo(toDoList, "   ");
        expect(addToDoResult.length).toEqual(1);
    });

    it("Valid input", () => {
        const toDoList = [{ id: Date.now(), text: "Feed cat", done: true }]
        expect(toDoList.length).toEqual(1);
        const addToDoResult = addTodo(toDoList, "Pet cat");
        expect(addToDoResult.length).toEqual(2);
        expect(addToDoResult[1].text).toBe("Pet cat");
        expect(addToDoResult[1].done).toBe(false);
        expect(typeof addToDoResult[1].id).toBe("number");
    });
});

describe("Loop coverage", () => {
    it("Empty array", () => {
        expect(countDone([])).toEqual(0);
    });

    it("One finished todo", () => {
        const todos = [
            { id: Date.now(), text: "Pet cat", done: true },
            { id: Date.now(), text: "Feed the dog", done: false },
            { id: Date.now(), text: "Buy groceries", done: false },
            { id: Date.now(), text: "Finish homework", done: false },
            { id: Date.now(), text: "Water the plants", done: false },
            { id: Date.now(), text: "Call grandma", done: false },
            { id: Date.now(), text: "Take out the trash", done: false },
            { id: Date.now(), text: "Read a book for 30 minutes", done: false },
            { id: Date.now(), text: "Do the laundry", done: false },
            { id: Date.now(), text: "Walk the dog", done: false }
        ];
        expect(countDone(todos)).toEqual(1);
    });

    it("Multiple finished todos", () => {
        const todos = [
            { id: Date.now(), text: "Pet cat", done: true },
            { id: Date.now(), text: "Feed the dog", done: false },
            { id: Date.now(), text: "Buy groceries", done: false },
            { id: Date.now(), text: "Finish homework", done: false },
            { id: Date.now(), text: "Water the plants", done: true },
            { id: Date.now(), text: "Call grandma", done: false },
            { id: Date.now(), text: "Take out the trash", done: true },
            { id: Date.now(), text: "Read a book for 30 minutes", done: false },
            { id: Date.now(), text: "Do the laundry", done: true },
            { id: Date.now(), text: "Walk the dog", done: false }
        ];
        expect(countDone(todos)).toEqual(4);
    });
})