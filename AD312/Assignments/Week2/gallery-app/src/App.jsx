import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import Gallery from "./Gallery.jsx";

const images = [
	{
		id: 1,
		url: "https://images.immediate.co.uk/production/volatile/sites/2/2023/09/Birria-tacos-88aff34.jpg",
		description: "Birria Tacos",
	},
	{
		id: 2,
		url: "https://images.immediate.co.uk/production/volatile/sites/2/2021/08/El-Pastor-Soho-039-8e17848.jpg",
		description: "Cochinita Pilbil",
	},
	{
		id: 3,
		url: "https://images.immediate.co.uk/production/volatile/sites/2/2019/07/Tacos-149a62f.jpg",
		description: "Tacos Al Pastor",
	},
];

function App() {
	return (
		<>
			<section id="center">
				<Gallery images={images} />
			</section>
		</>
	);
}

export default App;
