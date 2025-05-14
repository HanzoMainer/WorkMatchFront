import { SignUp } from "./pages/signup-page/index.jsx";
import { SignIn } from "./pages/signin-page/index.jsx";
import { UserMain } from "./pages/main-pages/user-main-page/index.jsx";
import { HRMain } from "./pages/main-pages/hr-main-page/index.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route
                        path="/"
                        element={<Navigate to="/signin" replace />}
                    />
                    <Route path="signup" element={<SignUp />} />
                    <Route path="signin" element={<SignIn />} />
                    <Route path="usermain" element={<UserMain />} />
                    <Route path="hrmain" element={<HRMain />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
