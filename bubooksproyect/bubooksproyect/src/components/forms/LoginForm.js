import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../../Api';
import './LoginForm.css';

const LoginForm = ({ userType }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // Update the corresponding state based on the input field name
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // Validate username and password before making the API request
    if (username === '') {
      setError('The username cannot be empty.');
      return;
    }
    if (password === '') {
      setError('The password cannot be empty.');
      return;
    }
    try {
      // Make the login API request
      const response = await Api.login({ username, password });
      if (response.error) {
        setError(response.error);
      } else {
        // Check the user type and navigate accordingly
        if (response.is_author == true && userType === 'author') {
          const token = response.token;
          localStorage.setItem('token', token);
          if (!localStorage.getItem('alias')) {
            navigate('/createProfile');
          } else {
            navigate(`/authorProfile/${localStorage.getItem('alias')}`);
          }
        } else if (response.is_author == false && userType === 'user') {
          const token = response.token;
          localStorage.setItem('token', token);
          navigate('/');
        } else {
          setError('User invalid');
        }
      }
    } catch (error) {
      setError('Error. Try again.');
    }
  };

  return (
    <div>
      <form className="loginForm" onSubmit={handleFormSubmit}>
        <label>Username</label>
        <input type="text" name="username" value={username} onChange={handleInputChange} />
        <label>Password</label>
        <input type="password" name="password" value={password} onChange={handleInputChange} />
        <button type="submit" className="buttonLogin">
          Login
        </button>
        <p className="signUpLink">
          New here?{' '}
          <a className="signUpLink" onClick={() => navigate('/signUpUser')}>
            Sign up
          </a>
        </p>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
