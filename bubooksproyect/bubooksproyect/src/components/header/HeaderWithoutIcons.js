import './Header.css'
import { useNavigate } from 'react-router-dom';

const HeaderWithoutIcons = () => {
  const navigate = useNavigate();

  return (
            <div className='backgroundHeader'>
              <h1 className='logo' onClick={() => navigate('/')}>
                <span className='blueLogo'>B</span>
                u<span className='blueLogo'>B</span>ooks
              </h1>
            </div>
  );
};
export default HeaderWithoutIcons