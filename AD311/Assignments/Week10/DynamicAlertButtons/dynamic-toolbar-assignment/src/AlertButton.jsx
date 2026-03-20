export default function AlertButton({ message, children }) {
	const handleClick = () => alert(message);
	return <button onClick={handleClick}>{children}</button>;
}
