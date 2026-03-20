export default function NestedButtons() {
	const handleOuterClick = () => alert("Outer!");
	const handleInnerClick = (e) => {
		e.stopPropagation();
		alert("Inner!");
	};

	return (
		<div
			onClick={handleOuterClick}
			style={{ width: "200px", height: "200px", backgroundColor: "blue" }}
		>
			<button onClick={handleInnerClick}>BUTTON</button>
		</div>
	);
}
