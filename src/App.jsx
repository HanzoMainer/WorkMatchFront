import { Login } from "./pages/login-page/index.jsx";
import { Sign } from "./pages/signin-page/index.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {"login"}
                <Route path="login" element={<Login />} />
                <Route path="sign" element={<Sign />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
