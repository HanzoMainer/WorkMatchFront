import { Login } from "./pages/login-page/index.jsx";
import { Sign } from "./pages/signin-page/index.jsx";
import { Main } from "./pages/main-page/index.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route
                        path="/"
                        element={<Navigate to="/login" replace />}
                    />
                    <Route path="login" element={<Login />} />
                    <Route path="sign" element={<Sign />} />
                    <Route path="main" element={<Main />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
