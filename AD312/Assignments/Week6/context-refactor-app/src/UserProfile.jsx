import { useContext } from "react";
import { UserContext } from "./UserContext";

export default function UserProfile() {
	const { user } = useContext(UserContext);
	return (
		<div>
			<h3>User Profile</h3>
			<div>Name: {user.name}</div>
			<div>Email: {user.email}</div>
			<div>Theme Preference: {user.themePreference}</div>
		</div>
	);
}
