import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function ResponsiveCard(props) {
	const mobileBreakpoint = { width: 768, height: 1364 };
	const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

	useEffect(
		() => {
			const resizeCard = (ev) => {
				setWindowSize({ width: window.innerWidth, height: window.innerHeight });
			};

			window.addEventListener("resize", resizeCard);

			return () => {
				window.removeEventListener("resize", resizeCard);
			};
		},
		/* 
    I chose this dependency array configuration (an empty array) because I wanted 
    the useEffect to only trigger when the component is mounted. If the dependency 
    array was not specified, then the useEffect would trigger on re-render, which 
    is not needed to subscribe an event.
    */
		[],
	);

	return (
		<Card
			style={{
				width: windowSize.width <= mobileBreakpoint.width ? 120 : 800,
				height: windowSize.height <= mobileBreakpoint.height ? 120 : 800,
				fontSize: windowSize.width <= mobileBreakpoint.width ? 2 : 16,
			}}
		>
			<CardHeader>
				<Typography>Card Header</Typography>
			</CardHeader>
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
