import AlertButton from "./AlertButton";

export default function Toolbar() {
	const buttons = [
		{ id: "btn_download", message: "Downloading!", children: "Download File" },
		{ id: "btn_sharing", message: "Sharing!", children: "Share Document" },
		{ id: "btn_upload", message: "Uploading!", children: "Upload Document" },
		{ id: "btn_edge1", children: "Upload Document" },
		{ id: "btn_edge2", message: "Uploading!" },
		{ id: "btn_edge3" },
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
