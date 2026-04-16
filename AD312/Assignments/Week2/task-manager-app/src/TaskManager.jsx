import { useState } from "react";

export function TaskManager() {
	const [tasks, setTasks] = useState([]);

	const addTask = () => {
		const title = prompt("Enter title");
		const newTask = {
			id: crypto.randomUUID(),
			title: title,
			completed: false,
		};
		const newTasks = [...tasks, newTask];
		setTasks(newTasks);
	};

	const toggleTaskCompletion = (taskId) => {
		const newTasks = tasks.map((val) => {
			if (val.id === taskId) {
				return { ...val, completed: !val.completed };
			} else {
				return val;
			}
		});
		setTasks(newTasks);
	};

	return (
		<div>
			<div>
				{tasks.map((val) => (
					<div style={{ display: "flex", flexDirection: "row" }}>
						<div style={{ display: "flex", flexDirection: "row" }}>
							<span>{val.title}</span>
							<input
								type="checkbox"
								onClick={toggleTaskCompletion}
								value={val.completed}
							/>
						</div>
					</div>
				))}
			</div>
			<button onClick={addTask}>Add Task</button>
		</div>
	);
}
