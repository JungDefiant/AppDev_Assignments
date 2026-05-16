import { createContext, useState } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
	const [name, setName] = useState("username");
	const [email, setEmail] = useState("email@email.com");
	const [themePreference, setThemePreference] = useState("dark");

	return (
		<UserContext value={{ user: { name, email, themePreference } }}>
			{children}
		</UserContext>
	);
}
