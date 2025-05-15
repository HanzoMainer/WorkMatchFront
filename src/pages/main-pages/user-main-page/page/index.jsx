import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Modal, Alert, Typography } from "@mui/material";
import { AuthContext } from "../../../../context/AuthContext";
import styles from "./style.module.css";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import VacancyCard from "../../components/VacancyCard";
import SpecialistCard from "../../components/SpecialistCard";
import ProfileModalForm from "../../components/ProfileModalForm";
import SpecialistModalForm from "../../components/SpecialistModalForm";
import PaginationComponent from "../../components/PaginationComponent";
import {
    Home as HomeIcon,
    Person as PersonIcon,
    Logout as LogoutIcon,
    List as ListIcon,
    AddCircle as AddCircleIcon,
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
    const [specialistData, setSpecialistData] = useState({
        position: "",
        about_me: "",
        employment_type_str: "",
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState("profile");
    const [page, setPage] = useState(1);
    const [vacancies, setVacancies] = useState([]);
    const [specialists, setSpecialists] = useState([]);
    const [totalVacancies, setTotalVacancies] = useState(0);
    const [totalSpecialists, setTotalSpecialists] = useState(0);
    const [viewMode, setViewMode] = useState("vacancies");
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

    const fetchSpecialists = async (pageNum) => {
        try {
            const skip = (pageNum - 1) * limit;
            let token = localStorage.getItem("access_token");
            let response = await fetch(
                `http://localhost:8000/v1/specialist/?skip=${skip}&limit=${limit}`,
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
                    `Ошибка ${response.status}: Не удалось загрузить специалистов`
                );
            }
            const data = await response.json();
            const specialistsArray = data.Specialists || [];
            const total = data.Count || 0;
            setSpecialists(specialistsArray);
            setTotalSpecialists(total);
            setError(null);
        } catch (err) {
            setError(err.message);
            setSpecialists([]);
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

    const createSpecialist = async (e) => {
        e.preventDefault();
        try {
            if (!specialistData.position)
                throw new Error("Должность обязательна");
            if (!specialistData.about_me)
                throw new Error("Поле 'О себе' обязательно");
            if (!specialistData.employment_type_str)
                throw new Error("Тип занятости обязателен");
            let token = localStorage.getItem("access_token");
            let response = await fetch("http://localhost:8000/v1/specialist/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(specialistData),
            });
            if (!response.ok) {
                throw new Error(
                    `Ошибка ${response.status}: Не удалось создать специалиста`
                );
            }
            setSuccess("Специалист успешно создан");
            setError(null);
            setSpecialistData({
                position: "",
                about_me: "",
                employment_type_str: "",
            });
            setOpenModal(false);
            if (viewMode === "specialists") {
                fetchSpecialists(page);
            }
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
        setError(null);
        setSuccess(null);
    };

    const handleHomeClick = () => {
        setViewMode("vacancies");
        setPage(1);
        fetchVacancies(1);
    };

    const handleSpecialistsClick = () => {
        setViewMode("specialists");
        setPage(1);
        fetchSpecialists(1);
    };

    const sidebarItems = [
        {
            label: "Главная",
            icon: <HomeIcon sx={{ mr: 1, color: "#283618" }} />,
            onClick: handleHomeClick,
        },
        {
            label: "Профиль",
            icon: <PersonIcon sx={{ mr: 1, color: "#283618" }} />,
            onClick: () => handleOpenModal("profile"),
        },
        {
            label: "Создать специалиста",
            icon: <AddCircleIcon sx={{ mr: 1, color: "#283618" }} />,
            onClick: () => handleOpenModal("specialist"),
        },
        {
            label: "Мои специалисты",
            icon: <ListIcon sx={{ mr: 1, color: "#283618" }} />,
            onClick: handleSpecialistsClick,
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
            if (viewMode === "vacancies") {
                fetchVacancies(page);
            } else {
                fetchSpecialists(page);
            }
        } else {
            navigate("/signin");
        }
    }, [isAuthenticated, navigate, page, viewMode]);

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
                        {viewMode === "vacancies"
                            ? "Вакансии сейчас"
                            : "Мои специалисты"}
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {viewMode === "vacancies" ? (
                        <>
                            {vacancies.length === 0 && !error && (
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                >
                                    Нет доступных вакансий
                                </Typography>
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
                        </>
                    ) : (
                        <>
                            {specialists.length === 0 && !error && (
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                >
                                    Вы пока не создали специалистов
                                </Typography>
                            )}
                            {specialists.map((specialist) => (
                                <SpecialistCard
                                    key={specialist.uuid}
                                    specialist={specialist}
                                />
                            ))}
                            {totalSpecialists > limit && (
                                <PaginationComponent
                                    count={Math.ceil(totalSpecialists / limit)}
                                    page={page}
                                    onChange={(e, value) => setPage(value)}
                                />
                            )}
                        </>
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
                            passwordData={passwordData}
                            setPasswordData={setPasswordData}
                            onSubmitProfile={updateProfile}
                            onSubmitPassword={changePassword}
                            error={error}
                            success={success}
                            onCancel={handleCloseModal}
                        />
                    )}
                    {modalType === "specialist" && (
                        <SpecialistModalForm
                            specialistData={specialistData}
                            setSpecialistData={setSpecialistData}
                            onSubmit={createSpecialist}
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
