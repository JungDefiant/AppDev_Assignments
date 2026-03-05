import './App.css';
import { ProfileCard } from './components/ProfileCard';

function App() {
  const photoSrc = "https://i.pravatar.cc/150?img=13";
  const fullName = "Guy Guyverson";
  const email = "guy.guyverson@email.com";
  return (
    <div className="App">
      <div>
        <ProfileCard photoSrc={photoSrc} fullName={fullName} email={email} />
      </div>
    </div>
  );
}

export default App;
