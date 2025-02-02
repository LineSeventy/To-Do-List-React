import  { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link,  } from 'react-router-dom';

function Navbar() {

  const [isNavCollapsed, setIsNavCollapsed] = useState(true);


  const toggleNavbar = () => setIsNavCollapsed(!isNavCollapsed);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-dark-subtle shadow">
      <div className="container">
        <Link className='navbar-brand' to="/Login">TODO</Link>


        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarNav"
          aria-expanded={!isNavCollapsed ? "true" : "false"}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>


        <div className={`collapse navbar-collapse ${isNavCollapsed ? '' : 'show'}`} id="navbarNav">
          <div className="navbar-nav ms-auto">
            <Link className='nav-link' to="/">Note</Link>
            <Link className="nav-link" to="/Login">Profile</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
