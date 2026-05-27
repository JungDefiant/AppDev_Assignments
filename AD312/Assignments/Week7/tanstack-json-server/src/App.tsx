import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserProfile from "./UserProfile";

export default function App() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: false },
		},
	});

	return (
		<QueryClientProvider client={queryClient}>
			<UserProfile />
		</QueryClientProvider>
	);
}
