import {
	QueryClient,
	QueryClientProvider,
	useMutation,
	useQuery,
} from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

type Inputs = {
	username: string;
	email: string;
	bio: string;
	notifications: string;
};

const queryClient = new QueryClient();

export default function UserProfile() {
	const JSON_SERVER_URL = "http://localhost:3000";
	const {
		register,
		handleSubmit,
		setValues,
		setError,
		reset,
		formState: { errors, isDirty },
	} = useForm<Inputs>();

	const resetAsyncForm = useCallback(async () => {}, [reset]);

	useEffect(() => {
		resetAsyncForm();
	}, [resetAsyncForm]);

	const updateMutation = useMutation({
		mutationFn: async (editProfileData: Inputs) => {
			if (editProfileData.email === "conflict@example.com") {
				throw Error("Email is invalid!");
			}
			return await fetch(`${JSON_SERVER_URL}/profile`, {
				method: "PUT",
				body: JSON.stringify(editProfileData),
				headers: {
					"Content-type": "application/json; charset=UTF-8",
				},
			});
		},
		onError: (err) => {
			setError("email", { message: err.message });
		},
		onSuccess: async (data) => {
			const updatedData = (await data.json()) as Inputs;
			if (updatedData) {
				console.log(updatedData);
				queryClient.invalidateQueries({ queryKey: ["userProfile"] });
				reset(updatedData);
			}
		},
	});

	const fetchData = async () => {
		const url = `${JSON_SERVER_URL}/profile`;
		const response = await fetch(url, {
			method: "GET",
		});
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return await response.json();
	};

	const result = useQuery({
		queryKey: ["userProfile"],
		queryFn: fetchData,
	});

	if (result.isPending) {
		return <span>Loading...</span>;
	}

	if (result.isError) {
		return <span>Error getting User Profile data!</span>;
	}

	if (result.isSuccess) {
		setValues(result.data);
	}

	const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
		updateMutation.mutate(data);
	};

	return (
		<QueryClientProvider client={queryClient}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label>Username</label>
					<input {...register("username")} />
					{errors.username && <span>This field is required</span>}
				</div>

				<div>
					<label>Email Address</label>
					<input {...register("email", { required: true })} />
					{errors.email && <span>This field is required</span>}
				</div>

				<div>
					<label>Biography</label>
					<input {...register("bio")} />
					{errors.bio && <span>This field is required</span>}
				</div>

				<div>
					<label>Notifications</label>
					<input {...register("notifications")} />
					{errors.notifications && <span>This field is required</span>}
				</div>

				<input type="submit" disabled={!isDirty || updateMutation.isPending} />
			</form>
		</QueryClientProvider>
	);
}
