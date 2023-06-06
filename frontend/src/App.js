import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Register from './components/User/Register';
import Login from './components/User/Login';
import UploadImage from './components/Image/UploadImage';
import AdminDashboard from './components/User/AdminDashboard';
import ModeratorDashboard from './components/User/ModeratorDashboard';
import useAuthContext from './hooks/use-auth-hook';

const App = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuthContext();
  return (
    <Fragment>
      <ToastContainer />
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home isLoggedIn={isLoggedIn} />} />
          <Route
            exact
            path="/register"
            element={<Register setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            exact
            path="/login"
            element={
              <Login setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />
            }
          />
          <Route exact path="/upload" element={<UploadImage />} />
          <Route
            exact
            path="/admin"
            element={<AdminDashboard isLoggedIn={isLoggedIn} />}
          />
          <Route
            exact
            path="/moderator"
            element={<ModeratorDashboard isLoggedIn={isLoggedIn} />}
          />
        </Routes>
      </Router>
    </Fragment>
  );
};

export default App;
