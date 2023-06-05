import './Header.css';
import { useNavigate } from 'react-router-dom';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useState, useEffect } from 'react';
import UserPopUp from '../popUp/UserPopUp';

const HeaderWithIcons = () => {
  const navigate = useNavigate();
  const [showUserPopUp, setShowUserPopUp] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogoClick = () => {
  const userType = localStorage.getItem('userType');

  if (isAuthenticated) {
    if (userType === 'author') {
      navigate(`/authorProfile/${localStorage.getItem("alias")}`);
    } else {
      navigate('/');
    }
  }
};
  const handleProfileIconClick = () => {
    if (isAuthenticated) {
      navigate('/userProfile');
    } else {
      setShowUserPopUp(true);
    }
  };

  const handleCartIconClick = () => {
    navigate('/cart')
  };



  return (
    <div className="backgroundHeader">
      <h1 className="logo" onClick={handleLogoClick}>
        <span className="blueLogo">B</span>
        u<span className="blueLogo">B</span>ooks
      </h1>
      {isAuthenticated && (
        <>
          <PersonRoundedIcon className="profileIcon" onClick={handleProfileIconClick} />
          <ShoppingCartOutlinedIcon className="cartIcon" onClick={handleCartIconClick} />

        </>
      )}
      {!isAuthenticated && <PersonRoundedIcon className="profileIcon" onClick={handleProfileIconClick} />}
      {!isAuthenticated && <UserPopUp isOpen={showUserPopUp} onClose={() => setShowUserPopUp(false)} />}
    </div>
  );
};

export default HeaderWithIcons;
