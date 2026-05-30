import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import ResponsiveCard from "./ResponsiveCard";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<section id="center">
				<ResponsiveCard />
			</section>
		</>
	);
}

export default App;
