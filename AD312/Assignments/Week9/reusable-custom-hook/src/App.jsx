import "./App.css";
import useWindowSize from "./useWindowSize";

function App() {
	const mobileBreakpoint = 768;
	const [windowSize] = useWindowSize();

	return (
		<section id="center">
			{windowSize.width > mobileBreakpoint ? (
				<div
					style={{
						borderStyle: "solid",
						borderColor: "black",
						borderWidth: 4,
						width: 480,
						height: 480,
					}}
				>
					<span>Desktop</span>
				</div>
			) : (
				<div
					style={{
						borderStyle: "solid",
						borderColor: "black",
						borderWidth: 4,
						width: 240,
						height: 240,
					}}
				>
					<span>Mobile</span>
				</div>
			)}
		</section>
	);
}

export default App;
