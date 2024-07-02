import './App.css';
import Navpatient from './components/Navbar/Navpatient';
import Navdoctor from './components/Navbar/Navdoctor';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login-page/Login';
import Register from './components/Register-page/Register';
// import ViewRecord from './components/ViewRecord/ViewRecord';
import Home from './components/Home/Home';

function App() {
  const location = useLocation();

  console.log(location.pathname); // Debugging log

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/' element={<Home />} />
        <Route path="/navpatient" element={<Navpatient />} />
        <Route path="/navdoctor" element={<Navdoctor />} />
        {/* <Route path="/viewrecord" element={<ViewRecord />} /> */}
      </Routes>
    </div>
  );
}

export default App;
