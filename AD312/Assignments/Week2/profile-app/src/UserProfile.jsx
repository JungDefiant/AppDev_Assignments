import { useState } from 'react';

export default function UserProfile() {
  const [userProfile, setUserProfile] = useState({
    name: "ABC",
    email: "ABC@ABC.COM",
    address: {
      street: "",
      city: "",
      country: ""
    }
  });

  const updateAddress = (evt) => {
    evt.preventDefault();
    const newAddress = {
      street: evt.currentTarget[0].value,
      city: evt.currentTarget[1].value,
      country: evt.currentTarget[2].value
    };
    setUserProfile({...userProfile, address: newAddress });
  }

  return (
    <>
      <form method="post" onSubmit={updateAddress} style={{ display: "flex", gap: 8 }}>
        <label>
          Street: <input name="street" defaultValue={userProfile.address.street} />
        </label>
        <label>
          City: <input name="city" defaultValue={userProfile.address.city} />
        </label>
        <label>
          Country: <input name="country" defaultValue={userProfile.address.country} />
        </label>
        <button type="submit">Submit form</button>
      </form>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <p>Name: {userProfile.name}</p>
        <p>Email: {userProfile.email}</p>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p>Street: {userProfile.address.street}</p>
          <p>City: {userProfile.address.city}</p>
          <p>Country: {userProfile.address.country}</p>
        </div>
      </div>
    </>
  )


}