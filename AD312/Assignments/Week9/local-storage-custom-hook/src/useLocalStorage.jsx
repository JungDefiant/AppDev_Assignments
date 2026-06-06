import { useEffect, useState } from "react";

export default function useLocalStorage(key, initValue = "") {
	const [value, setValue] = useState(localStorage.getItem(key) ?? initValue);

	useEffect(() => {
		localStorage.setItem(key, value);
	}, [key, value]);

	return [value, setValue];
}
