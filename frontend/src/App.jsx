import './App.css';
import Nav from './components/Nav';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login-page/Login';
import Register from './components/Register-page/Register';
import Home from './components/Home/Home';

function App() {
  const location = useLocation();

  return (
    <div className="App">
      {location.pathname !== '/' && <Nav />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/' element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
