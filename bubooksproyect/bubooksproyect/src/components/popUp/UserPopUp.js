import './UserPopUp.css';
import {useNavigate} from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';

const UserPopUp = ({isOpen, onClose}) => {
    const navigate = useNavigate();

    return(
        <div>
            {isOpen &&
            <div className='userPopUpBackground'>
                <CloseIcon className='closeIcon' onClick={onClose}/>
                <button className='popUpLoginButton' onClick={() => navigate('/loginUser')}>Login</button>
                <button className='popUpSignUpButton' onClick={() => navigate('/signUpUser')}>Sign up</button>
            </div>
                }
            </div>
    )
}

export default UserPopUp