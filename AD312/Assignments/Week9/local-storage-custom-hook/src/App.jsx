import { useState } from "react";
import "./App.css";
import useLocalStorage from "./useLocalStorage";

function App() {
	const colors = ["red", "green", "blue"];
	const [color, setColor] = useLocalStorage("color", colors[0]);
	const [index, setIndex] = useState(colors.indexOf(color));

	return (
		<section id="center">
			<div
				style={{
					background: color,
					width: 480,
					height: 480,
				}}
			></div>
			<button
				type="button"
				onClick={() => {
					let nextColorInd = index + 1;
					if (nextColorInd >= colors.length) {
						nextColorInd = 0;
					}

					setIndex(nextColorInd);
					setColor(colors[nextColorInd]);
				}}
			>
				Cycle Color
			</button>
		</section>
	);
}

export default App;
