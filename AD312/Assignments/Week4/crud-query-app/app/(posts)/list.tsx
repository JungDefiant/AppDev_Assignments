import { ScrollView, View, Text, StyleSheet, Button } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";

export default function CardList() {
	const router = useRouter();

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
		return <span>Loading...</span>;
	}

	if (result.isError) {
		return <span>Error: {result.error.message}</span>;
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
			<ScrollView contentContainerStyle={styles.container}>
				{data.map((val: any) => (
					<View style={styles.dataCard}>
						<Text style={styles.titleText}>{val.title}</Text>
						<Text>{val.body}</Text>
						<Button
							title="Edit"
							onPress={() => {
								router.push({
									pathname: "/(posts)/[id]",
									params: { id: val.id },
								});
							}}
						/>
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
