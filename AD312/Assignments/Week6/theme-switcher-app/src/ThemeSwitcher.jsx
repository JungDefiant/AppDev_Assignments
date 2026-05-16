import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

export default function ThemeSwitcher() {
	const { theme, setTheme } = useContext(ThemeContext);
	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			<span>Theme: {theme}</span>
			<button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
				Switch Theme
			</button>
		</div>
	);
}
