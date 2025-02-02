import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import CreateModal from "./CreateModal";

const Login: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); 
  const auth = getAuth();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {

        navigate("/profile"); 
      }
    });


    return () => unsubscribe();
  }, [auth, navigate]);

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
        <div className="card-body">
          <h4 className="card-title text-center mb-4">Login</h4>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" className="form-control" id="email" />
          </div>

          <div className="mb-3">
            <label htmlFor="pswd" className="form-label">Password</label>
            <input type="password" className="form-control" id="pswd" />
          </div>

          <div className="d-grid gap-2">
            <button className="btn btn-primary">Sign In</button>
            <button className="btn btn-link">Forgot Password</button>
            <button className="btn btn-success" onClick={() => setShowModal(true)}>
              Create Account
            </button>
          </div>
        </div>
      </div>

      {showModal && <CreateModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Login;
