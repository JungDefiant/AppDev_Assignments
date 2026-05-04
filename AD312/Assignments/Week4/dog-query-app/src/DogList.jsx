import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const DogListMode = Object.freeze({
	breeds: "Breeds",
	breedSingle: "BreedSingle",
	groups: "Groups",
	facts: "Facts",
});

export default function DogList() {
	const [mode, setMode] = useState(DogListMode.breeds);
	const [breedId, setBreedId] = useState("");

	return (
		<div
			style={{
				display: "flex",
				flexBasis: 2,
				flexFlow: "wrap",
				flexDirection: "column",
				paddingInline: 12,
			}}
		>
			{mode === DogListMode.breeds && <h1>Dog Breeds</h1>}
			{mode === DogListMode.breedSingle && <h1>Dog Breed by ID</h1>}
			{mode === DogListMode.facts && <h1>Dog Facts</h1>}
			{mode === DogListMode.groups && <h1>Dog Groups</h1>}
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					gap: 24,
					alignSelf: "center",
				}}
			>
				<button onClick={() => setMode(DogListMode.breeds)}>Breeds</button>
				<button
					onClick={() => {
						const breedId = prompt("Enter a breed id");
						if (breedId) {
							setBreedId(breedId);
							setMode(DogListMode.breedSingle);
						}
					}}
				>
					Breed By Id
				</button>
				<button onClick={() => setMode(DogListMode.facts)}>Facts</button>
				<button onClick={() => setMode(DogListMode.groups)}>Groups</button>
			</div>
			{mode === DogListMode.breeds && <DogBreedsList />}
			{mode === DogListMode.breedSingle && <DogBreedByIdDisplay id={breedId} />}
			{mode === DogListMode.facts && <DogFactsList />}
			{mode === DogListMode.groups && <DogGroupsList />}
		</div>
	);
}

function DogBreedsList() {
	const fetchData = async () => {
		const url = `https://dogapi.dog/api/v2/breeds`;
		const response = await fetch(url, {
			method: "GET",
		});
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return await response.json();
	};

	const result = useQuery({
		queryKey: ["dogBreeds"],
		queryFn: fetchData,
	});

	if (result.isPending) {
		return <span>Loading...</span>;
	}

	if (result.isError) {
		return <span>Error: {error.message}</span>;
	}

	if (result.isSuccess) {
		console.log("Successful fetch!");
	}

	const data = result.data.data;

	return data.map((dog) => {
		return (
			<div key={dog.id} style={{ paddingTop: 24 }}>
				<h2>{dog.attributes.name}</h2>
				<p>ID: {dog.id}</p>
				<p style={{ textAlign: "left" }}>
					Description: {dog.attributes.description}
				</p>
			</div>
		);
	});
}

function DogBreedByIdDisplay({ id = "1" }) {
	const fetchData = async () => {
		const url = `https://dogapi.dog/api/v2/breeds/${id}`;
		console.log(url);
		const response = await fetch(url, {
			method: "GET",
		});
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return await response.json();
	};

	const result = useQuery({
		queryKey: ["dogBreedId"],
		queryFn: fetchData,
	});

	if (result.isPending) {
		return <span>Loading...</span>;
	}

	if (result.isError) {
		return <span>Error: {error.message}</span>;
	}

	if (result.isSuccess) {
		console.log("Successful fetch!");
	}

	const data = result.data.data;

	console.log("DOG BY ID", data);

	return (
		<div key={data.id} style={{ paddingTop: 24 }}>
			<h2>{data.attributes.name}</h2>
			<p>ID: {data.id}</p>
			<p style={{ textAlign: "left" }}>
				Description: {data.attributes.description}
			</p>
		</div>
	);
}

function DogFactsList() {
	const fetchData = async () => {
		const url = `https://dogapi.dog/api/v2/facts?limit=5`;
		const response = await fetch(url, {
			method: "GET",
		});
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return await response.json();
	};

	const result = useQuery({
		queryKey: ["dogFacts"],
		queryFn: fetchData,
	});

	if (result.isPending) {
		return <span>Loading...</span>;
	}

	if (result.isError) {
		return <span>Error: {error.message}</span>;
	}

	if (result.isSuccess) {
		console.log("Successful fetch!");
	}

	const data = result.data.data;

	return data.map((dog, ind) => {
		return (
			<div key={dog.id}>
				<p style={{ textAlign: "left" }}>
					{ind + 1}. {dog.attributes.body}
				</p>
			</div>
		);
	});
}

function DogGroupsList() {
	const fetchData = async () => {
		const url = `https://dogapi.dog/api/v2/groups`;
		const response = await fetch(url, {
			method: "GET",
		});
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return await response.json();
	};

	const result = useQuery({
		queryKey: ["dogGroups"],
		queryFn: fetchData,
	});

	if (result.isPending) {
		return <span>Loading...</span>;
	}

	if (result.isError) {
		return <span>Error: {error.message}</span>;
	}

	if (result.isSuccess) {
		console.log("Successful fetch!");
	}

	const data = result.data.data;

	return data.map((dog) => {
		return (
			<div key={dog.id}>
				<p style={{ textAlign: "left" }}>{dog.attributes.name}</p>
			</div>
		);
	});
}
