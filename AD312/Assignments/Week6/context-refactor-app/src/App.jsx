import "./App.css";
import { UserProvider } from "./UserContext";
import Dashboard from "./Dashboard";

function App() {
	return (
		<>
			<section id="center">
				<UserProvider>
					<Dashboard />
				</UserProvider>
			</section>

			<div className="ticks"></div>
			<section id="spacer"></section>
		</>
	);
}

export default App;
