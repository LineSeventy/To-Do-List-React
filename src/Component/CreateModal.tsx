// CreateModal.tsx
import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { firebaseApp } from "../../firebase"; // Ensure this import is correct

interface Props {
  onClose: () => void;
}

const CreateModal: React.FC<Props> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateUsername = (username: string) => {
    const regex = /^[a-zA-Z0-9_]{3,}$/;
    return regex.test(username);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let newErrors = { email: "", username: "", password: "", confirmPassword: "" };

    if (!validateEmail(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!validateUsername(username)) {
      newErrors.username = "Username must be at least 3 characters and contain only letters, numbers, or underscores";
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.username && !newErrors.password && !newErrors.confirmPassword) {
      try {
        // Create user with Firebase Authentication
        const auth = getAuth(firebaseApp);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Store additional user info (like username) in Firestore
        const db = getFirestore(firebaseApp);
        const userRef = doc(db, "users", userCredential.user.uid);
        await setDoc(userRef, {
          username,
          email,
          createdAt: new Date(),
        });

        alert("Account created successfully!");
        onClose();
      } catch (error) {
        console.error("Error creating account:", error);
        alert("There was an error creating the account. Please try again.");
      }
    }
  };

  return (
    <div className="modal d-block h-100">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create Account</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="emailName" className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  id="emailName"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  className={`form-control ${errors.username ? "is-invalid" : ""}`}
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {errors.username && <div className="invalid-feedback">{errors.username}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="pswd" className="form-label">Password</label>
                <input
                  type="password"
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  id="pswd"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="pswdConfirm" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                  id="pswdConfirm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Close
                </button>
                <button type="submit" className="btn btn-primary" disabled={!email || !username || !password || !confirmPassword}>
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
