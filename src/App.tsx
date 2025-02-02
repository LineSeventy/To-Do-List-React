import { Outlet } from "react-router-dom";
import Navbar from "./Component/Navbar";
import RoutesLayout from "./Routes/Routes"; 

function App() {
  return (
    <>
      <Navbar />
      <RoutesLayout />
      <Outlet/>
    </>
  );
}

export default App;
