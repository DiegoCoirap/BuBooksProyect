import {Route, Routes} from "react-router-dom";
import NotFound from './screens/NotFound';
import Main from "./screens/main/Main";
import AuthorUserProfile from "./screens/user/authorProfile/AuthorProfile";
import BookPage from "./screens/user/bookPage/BookPage";

function App() {
    function App() {
        return (
            <Routes>
                <Route path='*' element={<NotFound/>}/>
                <Route path='/' element={<Main/>}/>
                <Route path="/author/:alias" element={<AuthorUserProfile/>}/>
                <Route path='bookPage/:id' element={<BookPage/>}/>
            </Routes>
        );
    }
}

export default App;
