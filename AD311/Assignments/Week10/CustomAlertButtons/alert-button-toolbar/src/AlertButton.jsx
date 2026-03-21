export default function AlertButton({ message, children }) {
	const handleClick = () => alert(message ?? "No message provided");
	return <button onClick={handleClick}>{children}</button>;
}
