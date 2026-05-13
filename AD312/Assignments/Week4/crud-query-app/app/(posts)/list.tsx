import {
	ScrollView,
	View,
	Text,
	StyleSheet,
	Button,
	TextInput,
} from "react-native";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function CardList() {
	const [filterUserId, setFilterUserId] = useState(-1);
	const router = useRouter();

	const deleteData = useMutation({
		mutationFn: async (params: { postId: number }) => {
			return await fetch(
				`https://jsonplaceholder.typicode.com/posts/${params.postId}`,
				{
					method: "DELETE",
				},
			);
		},
	});

	const patchData = useMutation({
		mutationFn: async (params: { newTitle: string; postId: number }) => {
			return await fetch(
				`https://jsonplaceholder.typicode.com/posts/${params.postId}`,
				{
					method: "PATCH",
					body: JSON.stringify({ title: params.newTitle }),
					headers: {
						"Content-type": "application/json; charset=UTF-8",
					},
				},
			);
		},
	});

	const fetchData = async () => {
		const url = `https://jsonplaceholder.typicode.com/posts`;
		const response = await fetch(url, {
			method: "GET",
		});
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return await response.json();
	};

	const result = useQuery({
		queryKey: ["poolList"],
		queryFn: fetchData,
	});

	if (result.isPending) {
		return (
			<View>
				<Text>Loading...</Text>
			</View>
		);
	}

	if (result.isError) {
		return (
			<View>
				<Text>Error: {result.error.message}</Text>
			</View>
		);
	}

	if (result.isSuccess) {
		console.log("Successful fetch!");
	}

	const data = result.data;

	return (
		<View>
			<Button
				title="Create Post"
				onPress={() => {
					router.push({
						pathname: "/(posts)/create",
					});
				}}
			/>
			<TextInput
				placeholder={"Search by User Id"}
				onChangeText={(text) => {
					const input = Number.parseInt(text);
					if (!input || input < 1) {
						setFilterUserId(-1);
						return;
					}

					setFilterUserId(input);
				}}
			/>
			<ScrollView contentContainerStyle={styles.container}>
				{data
					.filter((x: any) => filterUserId === -1 || x.userId === filterUserId)
					.map((val: any) => (
						<View key={val.id} style={styles.dataCard}>
							<Text style={styles.titleText}>{val.title}</Text>
							<Text>{val.body}</Text>
							<View style={styles.buttonRow}>
								<Button
									title="Change Title"
									onPress={() => {
										const res = prompt() as string;
										if (res) {
											patchData.mutate({ newTitle: res, postId: val.id });
										}
									}}
								/>
								<Button
									title="Edit"
									onPress={() => {
										router.push({
											pathname: "/(posts)/[id]",
											params: { id: val.id },
										});
									}}
								/>
								<Button
									title="Delete"
									onPress={() => {
										deleteData.mutate({ postId: val.id });
									}}
								/>
							</View>
						</View>
					))}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "column",
		alignItems: "center",
		gap: 8,
		paddingTop: 16,
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
	buttonRow: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: 8,
		paddingTop: 8,
	},
});
