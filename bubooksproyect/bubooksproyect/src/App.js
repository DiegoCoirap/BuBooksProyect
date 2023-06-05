import {Route, Routes} from "react-router-dom";
import NotFound from './screens/NotFound';

function App() {
    function App() {
        return (
            <Routes>
                <Route path='*' element={<NotFound/>}/>
            </Routes>
        );
    }
}

export default App;
