import { useEffect, useState } from "react";

export default function useWindowSize() {
	const [windowSize, setWindowSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	useEffect(() => {
		const resetWindowsSize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		window.addEventListener("resize", resetWindowsSize);

		return () => window.removeEventListener("resize", resetWindowsSize);
	}, []);

	return [windowSize];
}
