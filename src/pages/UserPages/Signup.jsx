import React, { useState } from "react";
import "./UserPages.css";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../../components/Footer/Footer";

import { useTheme } from "../../contexts/theme";

const Signup = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    bio: "",
    profileImage: null,
  });

  const [error, setError] = useState(null);

  const handleNext = () => {
    setStep(step + 1);
  };
  const handleBack = () => {
    setStep(step - 1);
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
    console.log(formData.profileImage);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("full_name", formData.full_name);
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("bio", formData.bio);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("profileImage", formData.profileImage);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to sign up");
      }
      toast.success("You have been signed up.");
      setError(null);
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  };

  return (
    <>
      <div className={`signup-container user-page-${theme}`}>
        <div className="form-left">
          <Link to={"/login"} className="new">
            Already have an account? <span> Login here.</span>
          </Link>
        </div>
        <div className="form-right">
          <h2 className="signup-title">Sign Up</h2>
          <p className="subtext">Create Your Account</p>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit} className="signup-form">
            {step === 1 && (
              <>
                <label className="signup-label">
                  Full Name
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="signup-input"
                    required
                  />
                </label>
                <label className="signup-label">
                  Email
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="signup-input"
                    required
                  />
                </label>
              </>
            )}
            {step === 2 && (
              <>
                <label className="signup-label">
                  Username
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="signup-input"
                    required
                  />
                </label>
                <label className="signup-label">
                  Password
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="signup-input"
                    required
                  />
                </label>
                <label className="signup-label">
                  Confirm Password
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="signup-input"
                    required
                  />
                </label>
              </>
            )}

            {step === 3 && (
              <>
                <label>
                  Bio:
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                  ></textarea>
                </label>
                <label className="signup-label">
                  Profile Image
                  <input
                    type="file"
                    name="profileImage"
                    onChange={handleFileChange}
                    className="signup-file-input"
                  />
                </label>
                <button type="submit" className="signup-button">
                  Sign Up
                </button>
              </>
            )}
          </form>
          <div className="step-btns">
            <button disabled={step === 1} onClick={handleBack}>
              Back
            </button>
            <button disabled={step === 3} onClick={handleNext}>
              Next
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Signup;
