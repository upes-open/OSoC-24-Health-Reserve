import './App.css';
import Nav from './components/Nav';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const location = useLocation();

  return (
    <div className="App">
      {location.pathname !== '/' && <Nav />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
