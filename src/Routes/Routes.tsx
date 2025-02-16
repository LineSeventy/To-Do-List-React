
import { Route, Routes } from 'react-router-dom';
import Login from '../Component/Login';
import MainPage from '../Component/MainPage';
import ErrorPage from '../Component/ErrorPage';
import Profile from '../Component/Profile';
import HomePage from '../Component/HomePage';

function RoutesLayout() {
  return (
   
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/" element={<HomePage />} />
        <Route path='/Main' element={<MainPage/>}/>
        <Route path="*" element={<ErrorPage />}/>
        <Route path='/Profile' element={<Profile/>}></Route>
      </Routes>

  );
}

export default RoutesLayout;
