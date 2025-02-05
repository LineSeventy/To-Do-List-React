import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container-fluid text-center mt-5 min-vh-90 d-flex flex-grow-1 align-content-center justify-content-center ">
      <div className="card p-4 shadow-lg ">
        <h1 className="mb-3">Welcome to Notes</h1>
        <p className="text-muted">
          Organize your thoughts, tasks, and ideas in one place.
        </p>

        {!isAuthenticated ? (
          <>
            <button
              className="btn btn-primary m-2"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="btn btn-outline-primary m-2"
              onClick={() => navigate("/Login")}
            >
              Sign Up
            </button>
          </>
        ) : (
          <button
            className="btn btn-success"
            onClick={() => navigate("/notes")}
          >
            Go to Notes
          </button>
        )}
      </div>
    </div>
  );
}

export default HomePage;
