import { useState } from "react";
import "./App.css";
import {
	useQuery,
	useMutation,
	useQueryClient,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import DogList from "./DogList";

// Create a client
const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<section id="center">
				<DogList />
			</section>
		</QueryClientProvider>
	);
}

export default App;
