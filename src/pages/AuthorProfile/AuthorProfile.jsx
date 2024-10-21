import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import "./AuthorProfile.css";
import { useAuthContext } from "../../contexts/auth";
import { toast } from "react-toastify";
import TopPanel from "../../components/TopPanel/TopPanel";

function AuthorProfile() {
  const { user } = useAuthContext();
  const [newDp, setNewDp] = useState(null);
  const [joined, setJoined] = useState("");
  const [inputsDisabled, setInputsDisabled] = useState(true);

  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    bio: "",
  });
  const [dp, setDp] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const toggleInputs = () => {
    setInputsDisabled(!inputsDisabled);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/users/${user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: user.token,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        setFormData({
          full_name: userData.full_name || "",
          username: userData.username || "",
          email: userData.email || "",
          bio: userData.bio || "",
        });
        setDp(userData.profile_image_url);
        const dateOnly = userData.created_at.split("T")[0];
        setJoined(dateOnly);
      } catch (err) {
        setError(err.message || "An error occurred");
      }
    };

    fetchUserData();
  }, [user]);

  const handleFileChange = (e) => {
    setNewDp(e.target.files[0]);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newDp) {
      formData.append({ profile_image_url: newDp });
    }
    try {
      const response = await fetch(`/users/${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: user.token,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      const result = await response.json();
      setSuccess("Profile updated successfully!");
      setError(null);
      setInputsDisabled(true);
      toast.success(success);
    } catch (err) {
      setError(err.message || "An error occurred");
      toast.warn(err);
    }
  };

  return (
    <div className="edit-profile">
      <form className="profile-form" onSubmit={handleSubmit}>
        {inputsDisabled && (
          <button className="float-btn" onClick={toggleInputs}>
            Edit
          </button>
        )}

        <div className="flexRow">
          <div className="form-group dp-holder">
            <label htmlFor="profile_image_url">
              <img
                className="profile-picture"
                src={dp}
                alt={formData.username}
              />
            </label>
            <input
              disabled={inputsDisabled}
              style={{ display: "none" }}
              type="file"
              id="profile_image_url"
              name="profile_image_url"
              onChange={handleFileChange}
            />
          </div>
          <div className="author-details">
            <div className="form-group">
              <input
                disabled={inputsDisabled}
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="other-details">
              <div className="form-group">
                <label htmlFor="username">USERNAME</label>
                <input
                  disabled={inputsDisabled}
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="username">EMAIL</label>
                <input
                  disabled={inputsDisabled}
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                ></input>
              </div>
              <div className="form-group">
                <label htmlFor="join">MEMBER SINCE</label>
                <input
                  disabled={inputsDisabled}
                  id="join"
                  name="join"
                  value={joined}
                  onChange={handleChange}
                ></input>
              </div>
            </div>
          </div>
        </div>
        <div className="form-group bio-form">
          <label htmlFor="bio">BIO</label>
          <textarea
            disabled={inputsDisabled}
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
          ></textarea>
        </div>
        {!inputsDisabled && (
          <div className="float-btn">
            <button id="submit-btn" type="submit">
              Save Changes
            </button>
            <button id="cancel-btn" onClick={toggleInputs}>
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default AuthorProfile;
