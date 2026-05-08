import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { Button, Text, TextInput, View, StyleSheet } from "react-native";

export default function CreatePost() {
	const { isPending, isError, isSuccess, mutate } = useMutation({
		mutationFn: async (newPostData) => {
			return await fetch("https://jsonplaceholder.typicode.com/posts", {
				method: "POST",
				body: JSON.stringify(newPostData),
				headers: {
					"Content-type": "application/json; charset=UTF-8",
				},
			});
		},
	});

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onSubmit = (data: any) => {
		console.log(data);
		mutate({ ...data, userId: 1 });
	};

	return (
		<View style={styles.container}>
			<View style={styles.inputRow}>
				<Text style={styles.inputLabel}>Title</Text>
				<Controller
					control={control}
					render={({ field }) => <TextInput {...field} placeholder={"title"} />}
					name="title"
					rules={{ required: "Enter a title" }}
				/>
			</View>

			<View style={styles.inputRow}>
				<Text style={styles.inputLabel}>Body</Text>
				<Controller
					control={control}
					render={({ field }) => <TextInput {...field} placeholder={"body"} />}
					name="body"
					rules={{ required: "Enter body text" }}
				/>
			</View>

			<Button title="Submit" onPress={handleSubmit(onSubmit)} />
			{isSuccess && <Text style={styles.inputLabel}>Updated!</Text>}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "column",
		alignItems: "center",
		gap: 8,
	},
	inputRow: {
		flexDirection: "row",
		gap: 8,
	},
	inputLabel: {
		fontSize: 16,
		fontWeight: 600,
	},
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 8,
		padding: 8,
		width: "100%",
	},
	dataCard: {
		borderWidth: 2,
		borderRadius: 16,
		shadowColor: "#FAFAFA",
		shadowOffset: { width: 2, height: 2 },
		paddingInline: 16,
		paddingBottom: 8,
		width: 600,
	},
	titleText: {
		fontSize: 24,
		fontWeight: 600,
		paddingBottom: 8,
	},
});
