import { useState } from "react";
import { TaskManager } from "./TaskManager";
import "./App.css";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<section id="center">
				<TaskManager />
			</section>
		</>
	);
}

export default App;
