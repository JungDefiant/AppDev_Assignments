import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function ResponsiveCard() {
	const mobileBreakpoint = { width: 768, height: 1024 };
	const [windowSize, setWindowSize] = useState({
		width: window ? window.innerWidth : 0,
		height: window ? window.innerHeight : 0,
	});

	useEffect(() => {
		const resizeCard = () => {
			setWindowSize({ width: window.innerWidth, height: window.innerHeight });
		};

		resizeCard();

		window.addEventListener("resize", resizeCard);

		return () => {
			window.removeEventListener("resize", resizeCard);
		};
	}, []);

	const isMobile = windowSize.width <= mobileBreakpoint.width;

	return (
		<Card
			style={{
				width: isMobile ? "120px" : "800px",
				height: isMobile ? "120px" : "800px",
				fontSize: isMobile ? "2px" : "16px",
			}}
		>
			<CardHeader title="Card Header" />
			<CardContent>
				<Typography>
					Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
					faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi
					pretium tellus duis convallis. Tempus leo eu aenean sed diam urna
					tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.
					Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut
					hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent
					per conubia nostra inceptos himenaeos.
				</Typography>
			</CardContent>
		</Card>
	);
}
