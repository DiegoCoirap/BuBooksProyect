import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../Api";
import "./SignUpForm.css";

const SignUpForm = ({ userType }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [author, setAuthor] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // Update the corresponding state based on the input field name
    if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "confirmEmail") {
      setConfirmEmail(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Perform form validations before making the API request
    if (username === "") {
      setError("The username cannot be empty");
      return;
    }
    if (email === "") {
      setError("The email cannot be empty");
      return;
    }
    if (email !== confirmEmail) {
      setError("Emails do not match.");
      return;
    }
    if (password === "") {
      setError("The password cannot be empty");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      let response;
      // Determine the user type and make the appropriate API request
      if (userType === "author") {
        setAuthor(true);
        response = await Api.signUp({
          username,
          email,
          password,
          is_author: true, // Use 'is_author' instead of 'author'
        });
      } else if (userType === "user") {
        setAuthor(false);
        response = await Api.signUp({
          username,
          email,
          password,
          is_author: false, // Use 'is_author' instead of 'author'
        });
      }

      if (response) {
        setToken(response);
        localStorage.setItem("token", response);
        // Redirect the user to the appropriate login page
        if (userType === "user") {
          navigate("/loginUser");
        } else if (userType === "author") {
          navigate("/loginAuthor");
        }
      }
    } catch (error) {
      setError("Error. Try again.");
    }
  };

  return (
    <div>
      <form className="signUpForm" onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          name="username"
          autoComplete="off"
          onChange={handleInputChange}
        />
        <label>Email</label>
        <input
          type="email"
          name="email"
          autoComplete="off"
          onChange={handleInputChange}
        />
        <label>Confirm your email</label>
        <input
          type="email"
          name="confirmEmail"
          autoComplete="off"
          onChange={handleInputChange}
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          autoComplete="off"
          onChange={handleInputChange}
        />
        <label>Confirm your password</label>
        <input
          type="password"
          name="confirmPassword"
          autoComplete="off"
          onChange={handleInputChange}
        />
        <button type="submit" className="buttonSignUp">
          Sign Up
        </button>
        <p className="signUpLink">
          Already have an account?{" "}
          <a className="signUpLink" onClick={() => navigate("/loginUser")}>
            Login
          </a>
        </p>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default SignUpForm;
