import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Modal, Alert, Typography } from "@mui/material";
import { AuthContext } from "../../../../context/AuthContext";
import styles from "./style.module.css";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import VacancyCard from "../../components/VacancyCard";
import ProfileModalForm from "../../components/ProfileModalForm";
import PasswordModalForm from "../../components/PasswordModalForm";
import PaginationComponent from "../../components/PaginationComponent";
import {
    Home as HomeIcon,
    Person as PersonIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
} from "@mui/icons-material";

export function UserMainBack() {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [editData, setEditData] = useState({
        full_name: "",
        email: "",
        username: "",
    });
    const [passwordData, setPasswordData] = useState({
        old_password: "",
        new_password: "",
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState("profile");
    const [page, setPage] = useState(1);
    const [vacancies, setVacancies] = useState([]);
    const [totalVacancies, setTotalVacancies] = useState(0);
    const limit = 3;

    const fetchVacancies = async (pageNum) => {
        try {
            const skip = (pageNum - 1) * limit;
            let token = localStorage.getItem("access_token");
            let response = await fetch(
                `http://localhost:8000/v1/vacancies/?skip=${skip}&limit=${limit}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                throw new Error(
                    `Ошибка ${response.status}: Не удалось загрузить вакансии`
                );
            }
            const data = await response.json();
            const vacanciesArray = data.Vacancies || [];
            const total = data.Count || 0;
            setVacancies(vacanciesArray);
            setTotalVacancies(total);
            setError(null);
        } catch (err) {
            setError(err.message);
            setVacancies([]);
        }
    };

    const fetchUserData = async () => {
        try {
            let token = localStorage.getItem("access_token");
            let response = await fetch("http://localhost:8000/v1/users/me", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(
                    `Ошибка ${response.status}: Не удалось получить данные пользователя`
                );
            }
            const data = await response.json();
            setUser(data);
            setEditData({
                full_name: data.full_name || "",
                email: data.email || "",
                username: data.username || "",
            });
        } catch (err) {
            setError(err.message);
            if (err.message.includes("Токен")) {
                logout();
                navigate("/signin");
            }
        }
    };

    const updateProfile = async (e) => {
        e.preventDefault();
        try {
            if (!editData.email.includes("@")) {
                throw new Error("Неверный формат email");
            }
            if (!editData.full_name || !editData.username) {
                throw new Error("Все поля должны быть заполнены");
            }
            let token = localStorage.getItem("access_token");
            let response = await fetch("http://localhost:8000/v1/users/edit", {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editData),
            });
            if (!response.ok) {
                throw new Error(
                    `Ошибка ${response.status}: Не удалось обновить профиль`
                );
            }
            const data = await response.json();
            setUser(data);
            setSuccess("Профиль успешно обновлен");
            setError(null);
        } catch (err) {
            setError(err.message);
            setSuccess(null);
        }
    };

    const changePassword = async (e) => {
        e.preventDefault();
        try {
            if (passwordData.new_password.length < 8) {
                throw new Error(
                    "Новый пароль должен содержать минимум 8 символов"
                );
            }
            let token = localStorage.getItem("access_token");
            let response = await fetch(
                "http://localhost:8000/v1/users/edit/password",
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(passwordData),
                }
            );
            if (!response.ok) {
                throw new Error(
                    `Ошибка ${response.status}: Не удалось сменить пароль`
                );
            }
            setSuccess("Пароль успешно изменен");
            setError(null);
            setPasswordData({ old_password: "", new_password: "" });
        } catch (err) {
            setError(err.message);
            setSuccess(null);
        }
    };

    const handleApply = async (vacancy) => {
        try {
            let token = localStorage.getItem("access_token");
            let response = await fetch(
                `http://localhost:8000/v1/vacancies/${vacancy.uuid}/apply`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                throw new Error(
                    `Ошибка ${response.status}: Не удалось отправить отклик`
                );
            }
            setSuccess("Отклик успешно отправлен");
            setError(null);
        } catch (err) {
            setError(err.message);
            setSuccess(null);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/signin");
    };

    const handleOpenModal = (type) => {
        setModalType(type);
        setOpenModal(true);
        setError(null);
        setSuccess(null);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const sidebarItems = [
        {
            label: "Главная",
            icon: <HomeIcon sx={{ mr: 1, color: "#283618" }} />,
            onClick: () => navigate("/usermain"),
        },
        {
            label: "Профиль",
            icon: <PersonIcon sx={{ mr: 1, color: "#283618" }} />,
            onClick: () => handleOpenModal("profile"),
        },
        {
            label: "Настройки",
            icon: <SettingsIcon sx={{ mr: 1, color: "#283618" }} />,
            onClick: () => handleOpenModal("password"),
        },
        {
            label: "Выйти",
            icon: <LogoutIcon sx={{ mr: 1, color: "#283618" }} />,
            onClick: handleLogout,
        },
    ];

    useEffect(() => {
        if (isAuthenticated) {
            fetchUserData();
            fetchVacancies(page);
        } else {
            navigate("/signin");
        }
    }, [isAuthenticated, navigate, page]);

    return (
        <Box className={styles.loginBackground}>
            <Header user={user} to="/usermain" />
            <Box className={styles.bodyLeg}>
                <Sidebar items={sidebarItems} />
                <Box className={styles.jobList}>
                    <Typography
                        variant="h4"
                        className={styles.font1}
                        gutterBottom
                    >
                        Вакансии сейчас
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {vacancies.map((vacancy) => (
                        <VacancyCard
                            key={vacancy.uuid}
                            vacancy={vacancy}
                            onApply={handleApply}
                        />
                    ))}
                    {totalVacancies > limit && (
                        <PaginationComponent
                            count={Math.ceil(totalVacancies / limit)}
                            page={page}
                            onChange={(e, value) => setPage(value)}
                        />
                    )}
                </Box>
            </Box>
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box>
                    {modalType === "profile" && user && (
                        <ProfileModalForm
                            user={user}
                            editData={editData}
                            setEditData={setEditData}
                            onSubmit={updateProfile}
                            error={error}
                            success={success}
                            onCancel={handleCloseModal}
                        />
                    )}
                    {modalType === "password" && (
                        <PasswordModalForm
                            passwordData={passwordData}
                            setPasswordData={setPasswordData}
                            onSubmit={changePassword}
                            error={error}
                            success={success}
                            onCancel={handleCloseModal}
                        />
                    )}
                </Box>
            </Modal>
        </Box>
    );
}
