import { Login } from "./pages/login-page/index.jsx";
import { LoginWho } from "./pages/login-page/components/who.jsx";
import { Sign } from "./pages/signin-page/index.jsx";
import { Main } from "./pages/main-page/index.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="login" element={<Login />} />
                <Route path="loginwho" element={<LoginWho />} />
                <Route path="sign" element={<Sign />} />
                <Route path="main" element={<Main />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
