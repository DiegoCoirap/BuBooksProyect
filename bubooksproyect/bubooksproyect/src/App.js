import {Route, Routes} from "react-router-dom";
import NotFound from './screens/NotFound';
import Main from "./screens/main/Main";
import AuthorUserProfile from "./screens/user/authorProfile/AuthorProfile";

function App() {
    function App() {
        return (
            <Routes>
                <Route path='*' element={<NotFound/>}/>
                <Route path='/' element={<Main/>}/>
                <Route path="/author/:alias" element={<AuthorUserProfile/>}/>
            </Routes>
        );
    }
}

export default App;
