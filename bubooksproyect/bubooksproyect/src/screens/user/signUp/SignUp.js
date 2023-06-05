import './SignUp.css'
import HeaderWithoutIcons from "../../../components/header/HeaderWithoutIcons";
import {useNavigate} from "react-router-dom";
import SignUpForm from "../../../components/forms/SignUpForm";

const SignUpUser = () => {
    const navigate = useNavigate();

    return(
        <div className={'signUpUser'}>
            <HeaderWithoutIcons/>
            <div className='boxSignUpUser'>
                <button className='UbuttonSignUpUser'>User</button>
                <button className='UbuttonSignUpAuthor' onClick={() => navigate('/signUpAuthor')}>Author</button>
                <div className='containerSignUpUser'>
                    <h2 className='signUpH2'>USER SIGN UP</h2>
                    <SignUpForm userType="user" />
                </div>
            </div>
        </div>
    )
}

export default SignUpUser