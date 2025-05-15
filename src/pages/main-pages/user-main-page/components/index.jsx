import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./style.module.css";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Card,
    CardContent,
    CardActions,
    Button,
    Modal,
    TextField,
    Avatar,
    Alert,
    Pagination,
} from "@mui/material";
import {
    Home as HomeIcon,
    Person as PersonIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    Info as InfoIcon,
} from "@mui/icons-material";
import { AuthContext } from "../../../../context/AuthContext";

export function UserMainBack() {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const [totalVacancies, setTotalVacancies] = useState(0);
    const { isAuthenticated, logout } = authContext;
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
    const [selectedVacancy, setSelectedVacancy] = useState(null);
    const limit = 3;

    const jobs = [
        {
            id: 1,
            title: "Frontend Developer",
            company: "TechCorp",
            location: "Москва",
            description: "Разработка современных веб-приложений на React.",
        },
        {
            id: 2,
            title: "Backend Developer",
            company: "SoftGroup",
            location: "Санкт-Петербург",
            description: "Создание серверной логики на Node.js и PostgreSQL.",
        },
        {
            id: 3,
            title: "UI/UX Designer",
            company: "DesignPro",
            location: "Новосибирск",
            description: "Дизайн интерфейсов и прототипирование.",
        },
        {
            id: 4,
            title: "Frontend Developer",
            company: "TechCorp",
            location: "Москва",
            description: "Разработка современных веб-приложений на React.",
        },
        {
            id: 5,
            title: "Backend Developer",
            company: "SoftGroup",
            location: "Санкт-Петербург",
            description: "Создание серверной логики на Node.js и PostgreSQL.",
        },
        {
            id: 6,
            title: "UI/UX Designer",
            company: "DesignPro",
            location: "Новосибирск",
            description: "Дизайн интерфейсов и прототипирование.",
        },
        {
            id: 7,
            title: "Frontend Developer",
            company: "TechCorp",
            location: "Москва",
            description: "Разработка современных веб-приложений на React.",
        },
        {
            id: 8,
            title: "Backend Developer",
            company: "SoftGroup",
            location: "Санкт-Петербург",
            description: "Создание серверной логики на Node.js и PostgreSQL.",
        },
        {
            id: 9,
            title: "UI/UX Designer",
            company: "DesignPro",
            location: "Новосибирск",
            description: "Дизайн интерфейсов и прототипирование.",
        },
        {
            id: 10,
            title: "Frontend Developer",
            company: "TechCorp",
            location: "Москва",
            description: "Разработка современных веб-приложений на React.",
        },
        {
            id: 11,
            title: "Backend Developer",
            company: "SoftGroup",
            location: "Санкт-Петербург",
            description: "Создание серверной логики на Node.js и PostgreSQL.",
        },
        {
            id: 12,
            title: "UI/UX Designer",
            company: "DesignPro",
            location: "Новосибирск",
            description: "Дизайн интерфейсов и прототипирование.",
        },
    ];

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

    const jobsPerPage = 8;
    const totalPages = Math.ceil(jobs.length / jobsPerPage);

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

    const handleLogout = () => {
        logout();
        navigate("/signin");
    };

    const handleOpenModal = (type, vacancy = null) => {
        if (type !== "vacancyDetails") {
            clearVacancies();
        }
        setSelectedVacancy(vacancy);
        setModalType(type);
        setOpenModal(true);
        setError(null);
        setSuccess(null);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedVacancy(null);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
        fetchVacancies(value);
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchUserData();
        } else {
            navigate("/signin");
        }
    }, [isAuthenticated, navigate]);

    const startIndex = (page - 1) * jobsPerPage;
    const currentJobs = jobs.slice(startIndex, startIndex + jobsPerPage);

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
                            <Link to="/usermain">
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
                        Найди работу
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
                            onClick={() => navigate("/usermain")}
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
                            onClick={handleLogout}
                        >
                            <LogoutIcon sx={{ mr: 1, color: "#283618" }} />
                            <Typography variant="body1">Выйти</Typography>
                        </button>
                    </Box>
                </Box>

                <Box className={styles.jobList}>
                    <Typography
                        variant="h4"
                        className={styles.font1}
                        gutterBottom
                    >
                        Вакансии сейчас
                    </Typography>

                    <Box className={styles.jobList}>
                        {useEffect(() => {
                            window.addEventListener("load", () =>
                                fetchVacancies(page)
                            );
                            return () =>
                                window.removeEventListener("load", () =>
                                    fetchVacancies(page)
                                );
                        }, [page])}
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}
                        {vacancies.map((vacancy) => (
                            <Card key={vacancy.uuid} className={styles.jobCard}>
                                <CardContent>
                                    <Typography variant="h6" color="#283618">
                                        {vacancy.title}
                                    </Typography>
                                    <Typography color="#606c38">
                                        {vacancy.description}
                                    </Typography>
                                    <Typography color="#606c38">
                                        Требования: {vacancy.requirements}
                                    </Typography>
                                    <Typography color="#606c38">
                                        Условия: {vacancy.conditions}
                                    </Typography>
                                    <Typography color="#606c38">
                                        Зарплата: {vacancy.salary}
                                    </Typography>
                                    <Typography color="#606c38">
                                        Тип занятости: {vacancy.employment_type}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        startIcon={<InfoIcon />}
                                        style={{ backgroundColor: "#283618" }}
                                        onClick={() =>
                                            handleOpenModal(
                                                "vacancyDetails",
                                                vacancy
                                            )
                                        }
                                    >
                                        Информация
                                    </Button>
                                </CardActions>
                            </Card>
                        ))}
                        {totalVacancies > limit && (
                            <Pagination
                                count={Math.ceil(totalVacancies / limit)}
                                page={page}
                                onChange={handlePageChange}
                                sx={{
                                    mt: 3,
                                    display: "flex",
                                    justifyContent: "center",
                                    marginBottom: "3%",
                                }}
                            />
                        )}
                    </Box>
                </Box>
            </Box>

            <Modal open={openModal} onClose={handleCloseModal}>
                <Box className={styles.modalBox}>
                    <Typography variant="h6" gutterBottom>
                        {modalType === "profile"
                            ? "Редактировать профиль"
                            : "Смена пароля"}
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
                                    color="#283618"
                                >
                                    Отмена
                                </Button>
                            </Box>
                        </form>
                    ) : (
                        selectedVacancy && (
                            <Box>
                                <TextField
                                    label="Название вакансии"
                                    value={selectedVacancy.title}
                                    fullWidth
                                    margin="normal"
                                    InputProps={{ readOnly: true }}
                                />
                                <TextField
                                    label="Описание"
                                    value={selectedVacancy.description}
                                    fullWidth
                                    margin="normal"
                                    multiline
                                    rows={4}
                                    InputProps={{ readOnly: true }}
                                />
                                <TextField
                                    label="Требования"
                                    value={selectedVacancy.requirements}
                                    fullWidth
                                    margin="normal"
                                    multiline
                                    rows={4}
                                    InputProps={{ readOnly: true }}
                                />
                                <TextField
                                    label="Условия"
                                    value={selectedVacancy.conditions}
                                    fullWidth
                                    margin="normal"
                                    multiline
                                    rows={4}
                                    InputProps={{ readOnly: true }}
                                />
                                <TextField
                                    label="Зарплата"
                                    value={selectedVacancy.salary}
                                    fullWidth
                                    margin="normal"
                                    InputProps={{ readOnly: true }}
                                />
                                <TextField
                                    label="Тип занятости"
                                    value={selectedVacancy.employment_type}
                                    fullWidth
                                    margin="normal"
                                    InputProps={{ readOnly: true }}
                                />
                                <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={handleCloseModal}
                                        style={{
                                            color: "#283618",
                                            borderColor: "#283618",
                                        }}
                                    >
                                        Закрыть
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        style={{ backgroundColor: "#283618" }}
                                    >
                                        Редактировать
                                    </Button>
                                </Box>
                            </Box>
                        )
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
