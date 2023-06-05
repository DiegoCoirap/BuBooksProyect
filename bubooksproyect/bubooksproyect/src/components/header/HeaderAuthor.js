import './Header.css'
import { useNavigate } from 'react-router-dom';

const HeaderAuthor= () => {
  const navigate = useNavigate();

  return (
            <div className='backgroundHeader'>
              <h1 className='logo' onClick={() => navigate(`/authorProfile/${localStorage.getItem('alias')}`)}>
                <span className='blueLogo'>B</span>
                u<span className='blueLogo'>B</span>ooks
              </h1>
            </div>
  );
};
export default HeaderAuthor