import {
	QueryClient,
	QueryClientProvider,
	useMutation,
	useQuery,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import UserProfile from "./UserProfile";

type Inputs = {
	username: string;
	email: string;
	bio: string;
	notifications: string;
};

export default function App() {
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<UserProfile />
		</QueryClientProvider>
	);
}
