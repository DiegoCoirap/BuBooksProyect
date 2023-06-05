import {Route, Routes} from "react-router-dom";
import NotFound from './screens/NotFound';
import Main from "./screens/main/Main";

function App() {
    function App() {
        return (
            <Routes>
                <Route path='*' element={<NotFound/>}/>
                <Route path='/' element={<Main/>}/>
            </Routes>
        );
    }
}

export default App;
