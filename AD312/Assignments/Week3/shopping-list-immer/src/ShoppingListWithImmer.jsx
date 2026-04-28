import { produce } from "immer";
import { useImmer } from "use-immer";

const baseItem = {
	id: 1,
	name: "N/A",
	quantity: 0,
	details: {
		category: "N/A",
		notes: "N/A",
	},
};

export default function ShoppingList({ itemArray }) {
	const [shoppingList, setShoppingList] = useImmer(itemArray);

	const setObjectProps = (props, baseProps) => {
		const newProps = { ...props };
		Object.entries(baseProps).forEach(([k, v]) => {
			if (k === "id") {
				return;
			}

			if (typeof baseProps[k] === "number") {
				const response = prompt(`Set new value for property: ${k}`);
				newProps[k] = parseInt(response) || 0;
			} else if (typeof baseProps[k] === "object") {
				newProps[k] = setObjectProps(newProps[k] || {}, baseProps[k]);
			} else {
				const response = prompt(`Set new value for property: ${k}`);
				newProps[k] = response || baseProps[k];
			}
		});

		return newProps;
	};

	const addItem = () => {
		const newItem = setObjectProps({ id: shoppingList.length + 1 }, baseItem);
		setShoppingList((draft) => {
			draft.push(newItem);
		});
	};

	const updateItem = () => {
		const response = prompt("Which ID to update?");
		const id = parseInt(response);
		if (!response) {
			return;
		}

		const newProps = setObjectProps({ id: id }, baseItem);
		setShoppingList((draft) => {
			const item = draft.find((x) => x.id === newProps.id);
			if (!item) {
				return;
			}

			Object.entries(newProps).forEach(([k, v]) => {
				if (newProps[k]) {
					item[k] = v;
				}
			});
		});
	};

	const removeItem = () => {
		const response = prompt("Which ID to remove?");
		const id = parseInt(response);
		if (!response || !id) {
			return;
		}
		setShoppingList((draft) => {
			return draft.filter((x) => x.id !== id);
		});
	};

	return (
		<div>
			<h3>Shopping List</h3>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					gap: 12,
					fontSize: 12,
				}}
			>
				<button onClick={addItem}>Add Item</button>
				<button onClick={updateItem}>Update Item</button>
				<button onClick={removeItem}>Remove Item</button>
			</div>
			{shoppingList.map((val) => {
				return (
					<div
						key={val.id}
						style={{
							display: "flex",
							flexDirection: "row",
							gap: 12,
							fontSize: 12,
						}}
					>
						<p>{val.id}.</p>
						<p>{val.name}</p>
						<p>x{val.quantity}</p>
						<p>| Category: {val.details && val.details.category}</p>
						<p>| Notes: {val.details && val.details.notes}</p>
					</div>
				);
			})}
		</div>
	);
}
