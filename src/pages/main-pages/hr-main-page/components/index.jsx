import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./style.module.css";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Button,
    Modal,
    TextField,
    Avatar,
    Alert,
} from "@mui/material";
import {
    Home as HomeIcon,
    Person as PersonIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    AddCircle as AddCircleIcon,
} from "@mui/icons-material";
import { AuthContext } from "../../../../context/AuthContext";

export function HRMainBack() {
    const navigate = useNavigate();
    const { isAuthenticated, logout, refreshToken, userRole } =
        useContext(AuthContext);
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
    const [vacancyData, setVacancyData] = useState({
        title: "",
        description: "",
        requirements: "",
        conditions: "",
        salary: "",
        employment_type_str: "",
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState("profile");
    const [page, setPage] = useState(1);

    const fetchUserData = async () => {
        try {
            let token = localStorage.getItem("access_token");
            if (!token) {
                throw new Error("Токен не найден. Пожалуйста, войдите снова.");
            }

            let response = await fetch("http://localhost:8000/v1/users/me", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 401) {
                token = await refreshToken();
                if (!token) {
                    throw new Error(
                        "Не удалось обновить токен. Пожалуйста, войдите снова."
                    );
                }

                response = await fetch("http://localhost:8000/v1/users/me", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            }

            if (!response.ok) {
                throw new Error(
                    `Ошибка ${response.status}: Не удалось получить данные пользователя`
                );
            }

            const data = await response.json();
            setUser(data);
            setEditData({
                full_name: data.full_name,
                email: data.email,
                username: data.username,
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

            if (response.status === 401) {
                token = await refreshToken();
                if (!token) {
                    throw new Error(
                        "Не удалось обновить токен. Пожалуйста, войдите снова."
                    );
                }

                response = await fetch("http://localhost:8000/v1/users/edit", {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(editData),
                });
            }

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

            if (response.status === 401) {
                token = await refreshToken();
                if (!token) {
                    throw new Error(
                        "Не удалось обновить токен. Пожалуйста, войдите снова."
                    );
                }

                response = await fetch(
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
            }

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

    const createVacancy = async (e) => {
        e.preventDefault();
        try {
            if (!vacancyData.title)
                throw new Error("Название вакансии обязательно");
            if (!vacancyData.description)
                throw new Error("Описание обязательно");
            if (!vacancyData.requirements)
                throw new Error("Требования обязательны");
            if (!vacancyData.conditions) throw new Error("Условия обязательны");
            if (!vacancyData.employment_type_str)
                throw new Error("Тип занятости обязателен");
            const salary = parseInt(vacancyData.salary, 10);
            if (isNaN(salary) || salary < 1)
                throw new Error("Зарплата должна быть положительным числом");

            const payload = {
                ...vacancyData,
                salary,
            };

            let token = localStorage.getItem("access_token");
            let response = await fetch("http://localhost:8000/v1/vacancies/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.detail ||
                        `Ошибка ${response.status}: Не удалось создать вакансию`
                );
            }

            setSuccess("Вакансия успешно создана");
            setError(null);
            setVacancyData({
                title: "",
                description: "",
                requirements: "",
                conditions: "",
                salary: "",
                employment_type_str: "",
            });
            setOpenModal(false);
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

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchUserData();
        } else {
            navigate("/signin");
        }
    }, [isAuthenticated, navigate]);

    return (
        <Box className={styles.loginBackground}>
            <AppBar
                position="static"
                className={styles.bodyHead}
                style={{ backgroundColor: "#283618" }}
            >
                <Toolbar style={{ backgroundColor: "#283618" }}>
                    <Box className={styles.logo}>
                        <Box className={styles.logoContainer}>
                            <Link to="/hrmain">
                                <img
                                    src="/Logo.svg"
                                    alt="Логотип"
                                    className={styles.logoPhoto}
                                />
                            </Link>
                        </Box>
                    </Box>
                    <Typography
                        variant="h6"
                        className={styles.textStyle}
                        sx={{ flexGrow: 1, justifySelf: "center" }}
                    >
                        Найти работу
                    </Typography>
                    {user && (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifySelf: "end",
                            }}
                        >
                            <Avatar sx={{ mr: 1 }}>
                                {user.full_name ? user.full_name[0] : "U"}
                            </Avatar>
                            <Typography className={styles.textStyle}>
                                {user.username}
                            </Typography>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>

            <Box className={styles.bodyLeg}>
                <Box
                    sx={{
                        width: 240,
                        flexShrink: 0,
                        mt: "10%",
                        backgroundColor: "#fefae0",
                        borderRight: "1px solid #ddd",
                    }}
                >
                    <Box className={styles.sidebarList}>
                        <button
                            className={styles.sidebarItem}
                            onClick={() => navigate("/hrmain")}
                        >
                            <HomeIcon sx={{ mr: 1, color: "#283618" }} />
                            <Typography variant="body1">Главная</Typography>
                        </button>
                        <button
                            className={styles.sidebarItem}
                            onClick={() => handleOpenModal("profile")}
                        >
                            <PersonIcon sx={{ mr: 1, color: "#283618" }} />
                            <Typography variant="body1">Профиль</Typography>
                        </button>
                        <button
                            className={styles.sidebarItem}
                            onClick={() => handleOpenModal("password")}
                        >
                            <SettingsIcon sx={{ mr: 1, color: "#283618" }} />
                            <Typography variant="body1">Настройки</Typography>
                        </button>
                        <button
                            className={styles.sidebarItem}
                            onClick={() => handleOpenModal("vacancy")}
                        >
                            <AddCircleIcon sx={{ mr: 1, color: "#283618" }} />
                            <Typography variant="body1">
                                Создать вакансию
                            </Typography>
                        </button>
                        <button
                            className={styles.sidebarItem}
                            onClick={handleLogout}
                        >
                            <LogoutIcon sx={{ mr: 1, color: "#283618" }} />
                            <Typography variant="body1">Выйти</Typography>
                        </button>
                    </Box>
                </Box>
            </Box>

            <Modal open={openModal} onClose={handleCloseModal}>
                <Box className={styles.modalBox}>
                    <Typography variant="h6" gutterBottom>
                        {modalType === "profile"
                            ? "Редактировать профиль"
                            : modalType === "password"
                            ? "Смена пароля"
                            : "Создать вакансию"}
                    </Typography>
                    {modalType === "profile" && user ? (
                        <form onSubmit={updateProfile}>
                            <TextField
                                label="Полное имя"
                                value={editData.full_name}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        full_name: e.target.value,
                                    })
                                }
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Email"
                                value={editData.email}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        email: e.target.value,
                                    })
                                }
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Имя пользователя"
                                value={editData.username}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        username: e.target.value,
                                    })
                                }
                                fullWidth
                                margin="normal"
                            />
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 2 }}
                            ></Typography>
                            <Typography variant="body2" color="text.secondary">
                                Роль: {user.role}
                            </Typography>
                            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    style={{ backgroundColor: "#283618" }}
                                >
                                    Сохранить
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={handleCloseModal}
                                    style={{
                                        color: "#283618",
                                        borderColor: "#283618",
                                    }}
                                >
                                    Отмена
                                </Button>
                            </Box>
                        </form>
                    ) : modalType === "password" ? (
                        <form onSubmit={changePassword}>
                            <TextField
                                label="Старый пароль"
                                type="password"
                                value={passwordData.old_password}
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,
                                        old_password: e.target.value,
                                    })
                                }
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Новый пароль"
                                type="password"
                                value={passwordData.new_password}
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,
                                        new_password: e.target.value,
                                    })
                                }
                                fullWidth
                                margin="normal"
                            />
                            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    style={{ backgroundColor: "#283618" }}
                                >
                                    Сменить пароль
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={handleCloseModal}
                                    style={{
                                        color: "#283618",
                                        borderColor: "#283618",
                                    }}
                                >
                                    Отмена
                                </Button>
                            </Box>
                        </form>
                    ) : (
                        <form onSubmit={createVacancy}>
                            <TextField
                                label="Название вакансии"
                                value={vacancyData.title}
                                onChange={(e) =>
                                    setVacancyData({
                                        ...vacancyData,
                                        title: e.target.value,
                                    })
                                }
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Описание"
                                value={vacancyData.description}
                                onChange={(e) =>
                                    setVacancyData({
                                        ...vacancyData,
                                        description: e.target.value,
                                    })
                                }
                                fullWidth
                                margin="normal"
                                multiline
                                rows={4}
                            />
                            <TextField
                                label="Требования"
                                value={vacancyData.requirements}
                                onChange={(e) =>
                                    setVacancyData({
                                        ...vacancyData,
                                        requirements: e.target.value,
                                    })
                                }
                                fullWidth
                                margin="normal"
                                multiline
                                rows={4}
                            />
                            <TextField
                                label="Условия"
                                value={vacancyData.conditions}
                                onChange={(e) =>
                                    setVacancyData({
                                        ...vacancyData,
                                        conditions: e.target.value,
                                    })
                                }
                                fullWidth
                                margin="normal"
                                multiline
                                rows={4}
                            />
                            <TextField
                                label="Зарплата"
                                type="number"
                                value={vacancyData.salary}
                                onChange={(e) =>
                                    setVacancyData({
                                        ...vacancyData,
                                        salary: e.target.value,
                                    })
                                }
                                fullWidth
                                margin="normal"
                                inputProps={{ min: 1 }}
                            />
                            <TextField
                                label="Тип занятости"
                                value={vacancyData.employment_type_str}
                                onChange={(e) =>
                                    setVacancyData({
                                        ...vacancyData,
                                        employment_type_str: e.target.value,
                                    })
                                }
                                fullWidth
                                margin="normal"
                            />
                            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    style={{ backgroundColor: "#283618" }}
                                >
                                    Создать
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={handleCloseModal}
                                    style={{
                                        color: "#283618",
                                        borderColor: "#283618",
                                    }}
                                >
                                    Отмена
                                </Button>
                            </Box>
                        </form>
                    )}
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            {success}
                        </Alert>
                    )}
                </Box>
            </Modal>
        </Box>
    );
}
