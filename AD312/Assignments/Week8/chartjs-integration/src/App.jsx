import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import DynamicPoll from "./DynamicPoll";

function App() {
	return (
		<>
			<section id="center">
				<DynamicPoll
					title={"Do you like to code?"}
					labels={["Yes", "No"]}
					data={[1, 0]}
				/>
			</section>
		</>
	);
}

export default App;
