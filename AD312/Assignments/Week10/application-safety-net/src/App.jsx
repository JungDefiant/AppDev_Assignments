
import "./App.css";
import { ErrorBoundary } from "./ErrorBoundary";
import Page from "./Page";

function App() {
	return (
		<ErrorBoundary fallback={<p>Something went wrong</p>}>
			<Page />
		</ErrorBoundary>
	);
}

export default App;
