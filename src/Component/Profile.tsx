import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<{ email: string; username: string }>({ email: "", username: "" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();


  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (!user) {

        navigate("/login");
        return;
      }


      const email = user.email;


      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const username = userDoc.data()?.username || "No username set";
        setUserData({ email: email || "", username });
      } else {

        console.log("User data not found in Firestore.");
      }

      setLoading(false);
    };

    fetchUserData();
  }, [auth, db, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
 
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="container">
      <h1>Profile</h1>
      <div className="card p-4 shadow-lg">
        <div className="card-body">
          <h4 className="card-title">User Information</h4>
          <div className="mb-3">
            <strong>Email:</strong> {userData.email}
          </div>
          <div className="mb-3">
            <strong>Username:</strong> {userData.username}
          </div>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
