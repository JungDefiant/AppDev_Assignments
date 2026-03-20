import AlertButton from "./AlertButton";

export default function Toolbar() {
	const buttons = [
		{ id: "btn_download", message: "Downloading!", children: "Download File" },
		{ id: "btn_sharing", message: "Sharing!", children: "Share Document" },
	];

	return (
		<>
			{buttons.map((buttonProps) => {
				return (
					<AlertButton
						key={buttonProps.id}
						message={buttonProps.message}
						children={buttonProps.children}
					/>
				);
			})}
		</>
	);
}
