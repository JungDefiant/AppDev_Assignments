import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { ContentA } from './components/ContentA';
import { ContentB } from './components/ContentB';
import { TestButton } from './components/SharedComponents';

function App() {
  return (
    <div className="App">
      <header>
        <Header />
      </header>
      <div>
        <ContentA />
        <ContentB />
        <TestButton />
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default App;
