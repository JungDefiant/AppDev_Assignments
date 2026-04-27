import { useImmer } from "use-immer";

export default function UserProfile() {
	const [userProfile, setUserProfile] = useImmer({
		name: "",
		email: "",
		contactDetails: { phone: "", address: "" },
		preferences: { newsletter: true, notifications: true },
	});

	const updateProfile = (evt) => {
		evt.preventDefault();
		const newName = evt.currentTarget[0].value;
		const newEmail = evt.currentTarget[1].value;
		setUserProfile((draft) => {
			draft.name = newName || draft.name;
			draft.email = newEmail || draft.email;
		});
	};

	const updateContactDetails = () => {
		const newPhone = prompt("Phone number?");
		const newAddress = prompt("Address?");
		setUserProfile((draft) => {
			draft.contactDetails.phone = newPhone;
			draft.contactDetails.address = newAddress;
		});
	};

	const toggleNewsletterSubscription = () => {
		setUserProfile((draft) => {
			draft.preferences.newsletter = !draft.preferences.newsletter;
		});
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: 12,
			}}
		>
			<h3>User Profile</h3>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "start",
					gap: 4,
					fontSize: 16,
				}}
			>
				<p>
					<strong>Name:</strong> {userProfile.name}
				</p>
				<p>
					<strong>Email:</strong> {userProfile.email}
				</p>
				<p>
					<strong>Contact Details</strong>
				</p>
				<p>- Phone: {userProfile.contactDetails.phone}</p>
				<p>- Address: {userProfile.contactDetails.address}</p>
				<p>
					<strong>Preferences</strong>
				</p>
				<p>
					- Newsletter Subscription:{" "}
					{userProfile.preferences.newsletter.toString()}
				</p>
				<p>
					- Notifications: {userProfile.preferences.notifications.toString()}
				</p>
			</div>
			<div
				style={{
					top: 24,
					display: "flex",
					flexDirection: "row",
					gap: 12,
					fontSize: 16,
				}}
			>
				<button onClick={updateContactDetails}>Update Contact Details</button>
				<button onClick={toggleNewsletterSubscription}>
					Toggle Newsletter Subscription
				</button>
			</div>
			<form
				method="post"
				onSubmit={updateProfile}
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "start",
					gap: 4,
					fontSize: 16,
				}}
			>
				<label>Enter Name:</label>
				<input name="name" defaultValue={userProfile.name} />
				<label>Enter Email:</label>
				<input name="email" defaultValue={userProfile.email} />
				<button type="submit">Submit</button>
			</form>
		</div>
	);
}
