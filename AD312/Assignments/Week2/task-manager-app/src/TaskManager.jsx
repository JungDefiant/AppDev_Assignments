import { useState } from "react";

export function TaskManager() {
	const [tasks, setTasks] = useState([]);

	const addTask = () => {
		const title = prompt("Enter title");
		if (title === null || title.trim() === "") {
			return;
		}

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
					<div key={val.id} style={{ display: "flex", flexDirection: "row" }}>
						<div style={{ display: "flex", flexDirection: "row" }}>
							<span>{val.title}</span>
							<input
								type="checkbox"
								checked={val.completed}
								onChange={() => toggleTaskCompletion(val.id)}
							/>
						</div>
					</div>
				))}
			</div>
			<button onClick={addTask}>Add Task</button>
		</div>
	);
}
