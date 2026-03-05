

export function ProfileCard(props)
{
  return (
    <div className="profile-card">
      <h2>User Profile</h2>
      <img src={props.photoSrc} alt="User Photo" className="photo"  id="profileCardPhoto"/>
      <p id="profileCardName">Name: {props.fullName}</p>
      <p id="profileCardEmail">Email: {props.email}</p>
      <a href={props.email}>Send Email</a>
    </div>
  );
}