import {Route, Routes} from "react-router-dom";
import NotFound from './screens/NotFound';
import Main from "./screens/main/Main";
import AuthorUserProfile from "./screens/user/authorProfile/AuthorProfile";
import BookPage from "./screens/user/bookPage/BookPage";
import Cart from "./screens/user/cart/Cart";
import LoginUser from "./screens/user/login/Login";
import UserProfile from "./screens/user/profile/Profile";
import SignUpUser from "./screens/user/signUp/SignUp";

function App() {
    function App() {
        return (
            <Routes>
                <Route path='*' element={<NotFound/>}/>
                <Route path='/' element={<Main/>}/>
                <Route path="/author/:alias" element={<AuthorUserProfile/>}/>
                <Route path='bookPage/:id' element={<BookPage/>}/>
                <Route path="/cart" element={<Cart/>}/>
                <Route path='loginUser' element={<LoginUser/>}/>
                <Route path="/userProfile" element={<UserProfile/>}/>
                <Route path='signUpUser' element={<SignUpUser/>}/>
            </Routes>
        );
    }
}

export default App;
