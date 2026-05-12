import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, TextInput, View, Text, StyleSheet } from "react-native";

export default function EditPost() {
	const params = useLocalSearchParams();

	const { isPending, isError, isSuccess, mutate } = useMutation({
		mutationFn: async (editPostData) => {
			return await fetch(
				`https://jsonplaceholder.typicode.com/posts/${data.id}`,
				{
					method: "PUT",
					body: JSON.stringify(editPostData),
					headers: {
						"Content-type": "application/json; charset=UTF-8",
					},
				},
			);
		},
	});

	const fetchData = async () => {
		const url = `https://jsonplaceholder.typicode.com/posts/${params.id}`;
		const response = await fetch(url, {
			method: "GET",
		});
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return await response.json();
	};

	const result = useQuery({
		queryKey: ["poolListSingle", params.id],
		queryFn: fetchData,
		// enabled: !!params.id,
	});

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		defaultValues: {
			title: "",
			body: "",
		},
	});

	useEffect(() => {
		if (result.isSuccess && result.data) {
			reset({
				title: result.data.title,
				body: result.data.body,
			});
		}
	}, [result.isSuccess, result.data, reset]);

	if (result.isPending || result.isLoading) {
		return (
			<View>
				<Text>Loading...</Text>
			</View>
		);
	}

	if (result.isError) {
		return <span>Error: {result.error.message}</span>;
	}

	if (result.isSuccess) {
		console.log("Successful fetch!");
	}

	const data = result.data;

	const onSubmit = (formData: any) => {
		console.log(formData);
		mutate(formData);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.titleText}>Edit Post</Text>

			<View style={styles.inputRow}>
				<Text style={styles.inputLabel}>Title</Text>
				<Controller
					control={control}
					render={({ field }) => (
						<TextInput {...field} placeholder={`${data.title}`} />
					)}
					name="title"
					rules={{ required: "Enter a title" }}
				/>
			</View>

			<View style={styles.inputRow}>
				<Text style={styles.inputLabel}>Body</Text>
				<Controller
					control={control}
					render={({ field }) => (
						<TextInput {...field} placeholder={`${data.body}`} />
					)}
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
