import AlertButton from "./AlertButton";

export default function Toolbar() {
	return (
		<>
			<AlertButton message={"Upload"} children={"Upload"} />
			<AlertButton message={"Play"} children={"Play"} />
			<AlertButton message={"Pause"} children={"Pause"} />
			<AlertButton message={"Pause"} />
			<AlertButton children={"Pause"} />
			<AlertButton />
		</>
	);
}
