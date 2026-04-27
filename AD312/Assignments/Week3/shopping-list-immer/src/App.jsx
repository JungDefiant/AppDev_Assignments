import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import ShoppingList from "./ShoppingListWithImmer";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<section id="center">
				<ShoppingList
					itemArray={[
						{
							id: 1,
							name: "Something",
							quantity: 2,
							details: {
								category: "product",
								notes: "N/A",
							},
						},
					]}
				/>
			</section>
		</>
	);
}

export default App;
