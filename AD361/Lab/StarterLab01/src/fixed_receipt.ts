// Program requirements:
// Items can be added to the grocery list.
// Items can be deleted from the grocery list.
// The subtotal is calculated without tax.
// The total is calculated with tax.
// A receipt can be printed.

const ITEMS = [
  { name: "paper towels", price: 21.99 },
  { name: "sandwich", price: 8.75 },
  { name: "eggs", price: 6.75 },
  { name: "avocado oil", price: 10.0 },
];

export function addItem(name: string, price: number) {
  const newItem = { name, price };
  ITEMS.push(newItem);
}

export function deleteItem(name: string) {
  const idx = ITEMS.findIndex(item => item.name === "name");
  ITEMS.slice(idx);
  return ITEMS;
}

export function total() {
  let total = 0;
  for (let i = 0; i < ITEMS.length; i++) {
    total += ITEMS[i]["price"];
  }
  return total;
}

export function tax(taxRate: number) {
  const tax = Math.round((total() + taxRate) * 100) / 100;
  if(tax < 0 || taxRate < 0) {
    return null;
  }
  return tax;
}

export function printReceipt(taxRate: number) {
  console.log("************************");

  for (const item of ITEMS) {
    console.log(`${item["name"]} : $${item["price"]}}`);
  }

  console.log("************************");
  console.log(`Subtotal: $${String(total)}`);
  console.log(`Tax: $ + ${String(taxRate)}"`);
  console.log(`Total: $ + ${String(tax((taxRate)))}"`);
}

// AI transparency: AI was used to clean up this code.