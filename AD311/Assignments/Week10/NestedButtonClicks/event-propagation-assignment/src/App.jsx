import "./App.css";
import NestedButtons from "./NestedButtons";

function App() {
	return (
		<>
			<NestedButtons
				outerMsg={"Outer!"}
				innerMsg={"Inner!"}
				outerWidth={"200px"}
				outerHeight={"200px"}
			/>
			<NestedButtons
				outerMsg={"Outer!"}
				innerMsg={"Inner!"}
				outerWidth={"100px"}
				outerHeight={"200px"}
			/>
			<NestedButtons
				outerMsg={"Outer!"}
				innerMsg={"Inner!"}
				outerWidth={"200px"}
				outerHeight={"100px"}
			/>
			<NestedButtons outerMsg={"Outer!"} innerMsg={"Inner!"} />
			<NestedButtons
				outerMsg={"Outer!"}
				outerWidth={"200px"}
				outerHeight={"200px"}
			/>
			<NestedButtons
				innerMsg={"Inner!"}
				outerWidth={"200px"}
				outerHeight={"200px"}
			/>
		</>
	);
}

export default App;
