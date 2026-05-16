import { createContext, useState } from "react";

export const LightTheme = {
	background: "white",
	color: "black",
};
export const DarkTheme = {
	background: "#222021",
	color: "white",
};
export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
	const [theme, setTheme] = useState("light");
	return (
		<ThemeContext value={{ theme, setTheme }}>
			<div style={theme === "light" ? LightTheme : DarkTheme}>{children}</div>
		</ThemeContext>
	);
}
