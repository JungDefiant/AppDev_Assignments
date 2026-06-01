import { Chart } from "chart.js/auto";
import { useEffect, useRef, useState } from "react";

export default function DynamicPoll(props) {
	const [results, setResults] = useState(props.data);
	const labels = useRef(props.labels);
	const chartInstanceRef = useRef();
	const canvasRef = useRef();

	// biome-ignore lint/correctness/useExhaustiveDependencies: Causes errors with chart not instantiating during mount
	useEffect(() => {
		if (!chartInstanceRef.current && canvasRef.current) {
			chartInstanceRef.current = new Chart(canvasRef.current, {
				type: "bar",
				data: {
					labels: labels.current,
					datasets: [
						{
							label: props.title,
							data: results,
							backgroundColor: "rgba(255, 100, 135, 1)",
							borderColor: "rgba(255, 55, 90, 1)",
							borderWidth: 1,
						},
					],
				},
				options: {
					responsive: true,
				},
			});
		}

		/*
    Attempting to create a new Chart on every state render causes errors
    because the same canvas cannot be used to render more than one Chart.
    The existing Chart in a canvas must be destroyed before rendering a
    new Chart to the same canvas.
    */
		return () => {
			if (chartInstanceRef.current && canvasRef.current) {
				chartInstanceRef.current.destroy();
			}
		};
	}, []);

	useEffect(() => {
		if (chartInstanceRef.current && canvasRef.current) {
			chartInstanceRef.current.data.datasets[0].data = results;
			chartInstanceRef.current.update();
		}
	}, [results]);

	const onOptionClick = (ev) => {
		const resultInd = labels.current.indexOf(ev.target.textContent);
		const newResults = [...results];
		newResults[resultInd]++;
		setResults(newResults);
	};

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
			<canvas ref={canvasRef}></canvas>
			<div style={{ display: "flex", flexDirection: "row", gap: 4 }}>
				{labels.current.map((label) => {
					return (
						<button
							type="button"
							key={`btn_${label.toLowerCase()}`}
							onClick={onOptionClick}
						>
							{label}
						</button>
					);
				})}
			</div>
		</div>
	);
}
