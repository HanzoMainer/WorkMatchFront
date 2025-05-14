import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem("access_token")
    );

    const signin = (accessToken, refreshToken) => {
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setIsAuthenticated(false);
    };

    const refreshToken = async () => {
        try {
            const refreshToken = localStorage.getItem("refresh_token");
            if (!refreshToken) {
                throw new Error("Refresh token не найден");
            }

            const response = await fetch("http://localhost:8000/v1/refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ refresh_token: refreshToken }),
            });

            if (!response.ok) {
                throw new Error("Не удалось обновить токен");
            }

            const { access_token, refresh_token } = await response.json();
            localStorage.setItem("access_token", access_token);
            if (refresh_token) {
                localStorage.setItem("refresh_token", refresh_token);
            }
            setIsAuthenticated(true);
            return access_token;
        } catch (err) {
            console.error("Ошибка обновления токена:", err.message);
            logout();
            return null;
        }
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, signin, logout, refreshToken }}
        >
            {children}
        </AuthContext.Provider>
    );
}
