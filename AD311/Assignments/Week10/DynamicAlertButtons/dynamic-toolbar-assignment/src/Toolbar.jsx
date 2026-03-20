import AlertButton from "./AlertButton";

export default function Toolbar() {
	const buttons = [
		{ message: "Downloading!", children: "Download File" },
		{ message: "Sharing!", children: "Share Document" },
	];

	return (
		<>
			{buttons.map((buttonProps) => {
				return (
					<AlertButton
						message={buttonProps.message}
						children={buttonProps.children}
					/>
				);
			})}
		</>
	);
}
