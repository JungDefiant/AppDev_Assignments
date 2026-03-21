export default function NestedButtons({
	outerMsg,
	innerMsg,
	outerWidth,
	outerHeight,
}) {
	const handleOuterClick = () => alert(outerMsg ?? "No outer message");
	const handleInnerClick = (e) => {
		e.stopPropagation();
		alert(innerMsg ?? "No inner message");
	};

	return (
		<div
			onClick={handleOuterClick}
			style={{
				width: outerWidth,
				height: outerHeight,
				backgroundColor: "blue",
			}}
		>
			<button onClick={handleInnerClick}>BUTTON</button>
		</div>
	);
}
