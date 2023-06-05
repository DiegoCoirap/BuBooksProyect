import './Login.css';
import HeaderWithoutIcons from '../../../components/header/HeaderWithoutIcons';
import LoginForm from '../../../components/forms/LoginForm';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const LoginUser = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Set the user type in localStorage when the component mounts
    localStorage.setItem('userType', 'user');
  }, []);

  return (
    <div className="loginUser">
      <HeaderWithoutIcons />
      <div className="boxLoginUser">
        <button className="UbuttonLoginUser">User</button>
        <button
          className="UbuttonLoginAuthor"
          onClick={() => navigate('/loginAuthor')}
        >
          Author
        </button>
        <div className="containerLoginUser">
          <h2 className="loginH2">USER LOGIN</h2>
          <LoginForm userType="user" />
        </div>
      </div>
    </div>
  );
};

export default LoginUser;
