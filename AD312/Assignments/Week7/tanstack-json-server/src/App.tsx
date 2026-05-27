import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserProfile from "./UserProfile";

export default function App() {
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<UserProfile queryClient={queryClient} />
		</QueryClientProvider>
	);
}
