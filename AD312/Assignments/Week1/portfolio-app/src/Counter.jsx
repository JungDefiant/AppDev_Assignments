import { useState } from "react";

export default function Counter() {
	let [count, setCount] = useState(0);

	const increment = () => {
		setCount(count + 1);
	};

	const incrementAfterDelay = () => {
		setTimeout(() => {
			setCount(count + 1);
		}, 2000);
	};

	const incrementTwice = () => {
		count + 2;
	};

	const correctIncrementTwice = () => {
		setCount(count + 2);
	};

	return (
		<div>
			<div>Count: {count}</div>
			<div
				style={{
					display: "flex",
					maxWidth: "50%",
					alignItems: "center",
					justifyItems: "center",
					flexDirection: "column",
				}}
			>
				<button onClick={increment}>Increment</button>
				<button onClick={incrementAfterDelay}>Increment After Delay</button>
				<button onClick={incrementTwice}>Increment Twice</button>
				<button onClick={correctIncrementTwice}>Correct Increment Twice</button>
			</div>
		</div>
	);
}
