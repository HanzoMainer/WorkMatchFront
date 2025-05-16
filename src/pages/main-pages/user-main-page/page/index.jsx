import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Modal,
    Alert,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import { AuthContext } from "../../../../context/AuthContext";
import styles from "./style.module.css";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import VacancyCard from "../../components/VacancyCard";
import SpecialistCard from "../../components/SpecialistCard";
import ApplicationCard from "../../components/ApplicationCard";
import ProfileModalForm from "../../components/ProfileModalForm";
import SpecialistModalForm from "../../components/SpecialistModalForm";
import PaginationComponent from "../../components/PaginationComponent";
import {
    Home as HomeIcon,
    Person as PersonIcon,
    Logout as LogoutIcon,
    List as ListIcon,
    AddCircle as AddCircleIcon,
    Bookmark as BookmarkIcon,
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
    const [selectedSpecialist, setSelectedSpecialist] = useState(null);
    const [selectedSpecialistUuid, setSelectedSpecialistUuid] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState("profile");
    const [page, setPage] = useState(1);
    const [vacancies, setVacancies] = useState([]);
    const [specialists, setSpecialists] = useState([]);
    const [applications, setApplications] = useState([]);
    const [totalVacancies, setTotalVacancies] = useState(0);
    const [totalSpecialists, setTotalSpecialists] = useState(0);
    const [totalApplications, setTotalApplications] = useState(0);
    const [viewMode, setViewMode] = useState("vacancies");
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [applicationToDelete, setApplicationToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const limit = 3;

    const fetchVacancies = async (pageNum, query = "") => {
        try {
            const skip = (pageNum - 1) * limit;
            let token = localStorage.getItem("access_token");
            let url = `http://localhost:8000/v1/vacancies/?skip=${skip}&limit=${limit}`;

            if (query.trim() !== "") {
                url = `http://localhost:8000/v1/vacancies/search?query=${encodeURIComponent(
                    query
                )}&skip=${skip}&limit=${limit}`;
            }

            let response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
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

    const fetchApplications = async (pageNum, specialistUuid) => {
        try {
            const skip = (pageNum - 1) * limit;
            let token = localStorage.getItem("access_token");
            let response = await fetch(
                `http://localhost:8000/v1/applications/specialist/${specialistUuid}?skip=${skip}&limit=${limit}`,
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
                    `Ошибка ${response.status}: Не удалось загрузить отклики`
                );
            }
            const data = await response.json();
            const applicationsArray = data.applications || [];
            const total = data.applications?.length || 0;
            const vacanciesData = await Promise.all(
                applicationsArray.map(async (app) => {
                    let vacResponse = await fetch(
                        `http://localhost:8000/v1/vacancies/${app.vacancy_uuid}`,
                        {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    return vacResponse.ok ? await vacResponse.json() : null;
                })
            );
            setApplications(
                applicationsArray.map((app, index) => ({
                    ...app,
                    vacancy: vacanciesData[index],
                }))
            );
            setTotalApplications(total);
            setError(null);
        } catch (err) {
            setError(err.message);
            setApplications([]);
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
            fetchSpecialists(1);
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
            setTimeout(() => setSuccess(null), 3000);
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
            setOpenModal(false);
            setTimeout(() => setSuccess(null), 3000);
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
            fetchSpecialists(1);
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.message);
            setSuccess(null);
        }
    };

    const deleteSpecialist = async (specialistUuid) => {
        try {
            let token = localStorage.getItem("access_token");
            let response = await fetch(
                `http://localhost:8000/v1/specialist/${specialistUuid}
                `,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                throw new Error(
                    `Ошибка ${response.status}: Не удалось удалить специалиста`
                );
            }
            setSuccess("Специалист успешно удален");
            setError(null);
            fetchSpecialists(page);
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.message);
            setSuccess(null);
        }
    };

    const editSpecialist = async (e) => {
        e.preventDefault();
        try {
            if (!specialistData.position)
                throw new Error("Должность обязательна");
            if (!specialistData.about_me)
                throw new Error("Поле 'О себе' обязательно");
            if (!specialistData.employment_type_str)
                throw new Error("Тип занятости обязателен");
            let token = localStorage.getItem("access_token");
            let response = await fetch(
                `http://localhost:8000/v1/specialist/edit/${selectedSpecialist.uuid}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(specialistData),
                }
            );
            if (!response.ok) {
                throw new Error(
                    `Ошибка ${response.status}: Не удалось обновить специалиста`
                );
            }
            setSuccess("Специалист успешно обновлен");
            setError(null);
            setSpecialistData({
                position: "",
                about_me: "",
                employment_type_str: "",
            });
            setSelectedSpecialist(null);
            setOpenModal(false);
            fetchSpecialists(page);
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.message);
            setSuccess(null);
        }
    };

    const addSkill = async (specialistUuid, skill) => {
        try {
            let token = localStorage.getItem("access_token");
            let response = await fetch(
                `http://localhost:8000/v1/specialist/${specialistUuid}/skill`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ skill }),
                }
            );
            if (!response.ok) {
                throw new Error(
                    `Ошибка ${response.status}: Не удалось добавить навык`
                );
            }
            setSuccess("Навык успешно добавлен");
            setError(null);
            if (viewMode === "specialists") {
                fetchSpecialists(page);
            }
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.message);
            setSuccess(null);
        }
    };

    const deleteSkill = async (specialistUuid, skill) => {
        try {
            let token = localStorage.getItem("access_token");
            let response = await fetch(
                `http://localhost:8000/v1/specialist/${specialistUuid}/skill/${encodeURIComponent(
                    skill
                )}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                throw new Error(
                    `Ошибка ${response.status}: Не удалось удалить навык`
                );
            }
            setSuccess("Навык успешно удален");
            setError(null);
            if (viewMode === "specialists") {
                fetchSpecialists(page);
            }
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.message);
            setSuccess(null);
        }
    };

    const addExperience = async (specialistUuid, experience) => {
        try {
            let token = localStorage.getItem("access_token");
            let response = await fetch(
                `http://localhost:8000/v1/specialist/${specialistUuid}/experience`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(experience),
                }
            );
            if (!response.ok) {
                throw new Error(
                    `Ошибка ${response.status}: Не удалось добавить опыт работы`
                );
            }
            setSuccess("Опыт работы успешно добавлен");
            setError(null);
            if (viewMode === "specialists") {
                fetchSpecialists(page);
            }
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.message);
            setSuccess(null);
        }
    };

    const deleteExperience = async (specialistUuid, experienceUuid) => {
        try {
            let token = localStorage.getItem("access_token");
            let response = await fetch(
                `http://localhost:8000/v1/specialist/${specialistUuid}/experience/${experienceUuid}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                throw new Error(
                    `Ошибка ${response.status}: Не удалось удалить опыт работы`
                );
            }
            setSuccess("Опыт работы успешно удален");
            setError(null);
            if (viewMode === "specialists") {
                fetchSpecialists(page);
            }
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.message);
            setSuccess(null);
        }
    };

    const createApplication = async (specialistUuid, vacancyUuid) => {
        if (!specialistUuid) {
            setError("Выберите специалиста для отправки отклика");
            setTimeout(() => setError(null), 3000);
            return;
        }
        try {
            let token = localStorage.getItem("access_token");
            let response = await fetch(
                `http://localhost:8000/v1/applications/${specialistUuid}/${vacancyUuid}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        o_id: 0,
                        specialist_uuid: specialistUuid,
                        vacancy_uuid: vacancyUuid,
                    }),
                }
            );
            if (!response.ok) {
                throw new Error(
                    `Ошибка ${response.status}: Не удалось отправить отклик`
                );
            }
            setSuccess("Отклик успешно отправлен");
            setError(null);
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.message);
            setSuccess(null);
            setTimeout(() => setError(null), 3000);
        }
    };

    const deleteApplication = async (specialistUuid, vacancyUuid) => {
        try {
            let token = localStorage.getItem("access_token");
            let response = await fetch(
                `http://localhost:8000/v1/applications/${specialistUuid}/${vacancyUuid}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                throw new Error(
                    `Ошибка ${response.status}: Не удалось удалить отклик`
                );
            }
            setSuccess("Отклик успешно удален");
            setError(null);
            if (selectedSpecialistUuid) {
                fetchApplications(page, selectedSpecialistUuid);
            }
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.message);
            setSuccess(null);
            setTimeout(() => setError(null), 3000);
        }
    };

    const searchVacancies = async (query, skip, limit) => {
        try {
            let token = localStorage.getItem("access_token");
            let response = await fetch(
                `http://localhost:8000/v1/vacancies/search?query=${query}&skip=${skip}&limit=${limit}`,
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
                    `Ошибка ${response.status}: Не удалось выполнить поиск`
                );
            }
            setSuccess("Поиск выполнен успешно");
            const data = await response.json();
            setVacancies(data.Vacancies || []);
            setTotalVacancies(data.Count || 0);
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.message);
            setSuccess(null);
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleOpenDeleteDialog = (specialistUuid, vacancyUuid) => {
        setApplicationToDelete({ specialistUuid, vacancyUuid });
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setApplicationToDelete(null);
    };

    const handleConfirmDelete = () => {
        if (applicationToDelete) {
            deleteApplication(
                applicationToDelete.specialistUuid,
                applicationToDelete.vacancyUuid
            );
        }
        handleCloseDeleteDialog();
    };

    const handleLogout = () => {
        logout();
        navigate("/signin");
        setSelectedSpecialistUuid("");
        setSearchQuery("");
        setSuccess(null);
        setError(null);
    };

    const handleOpenModal = (type, specialist = null) => {
        setModalType(type);
        setSelectedSpecialist(specialist);
        if (type === "specialist" && specialist) {
            setSpecialistData({
                position: specialist.position || "",
                about_me: specialist.about_me || "",
                employment_type_str: specialist.employment_type_str || "",
            });
        } else if (type === "specialist") {
            setSpecialistData({
                position: "",
                about_me: "",
                employment_type_str: "",
            });
        }
        setOpenModal(true);
        setSelectedSpecialistUuid("");
        setSearchQuery("");
        setError(null);
        setSuccess(null);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedSpecialist(null);
        setError(null);
        setSuccess(null);
        setSpecialistData({
            position: "",
            about_me: "",
            employment_type_str: "",
        });
    };

    const handleHomeClick = () => {
        setViewMode("vacancies");
        setPage(1);
        fetchVacancies(1);
        setSelectedSpecialistUuid("");
        setSearchQuery("");
        setSuccess(null);
        setError(null);
    };

    const handleSpecialistsClick = () => {
        setViewMode("specialists");
        setPage(1);
        fetchSpecialists(1);
        setSelectedSpecialistUuid("");
        setSearchQuery("");
        setSuccess(null);
        setError(null);
    };

    const handleApplicationsClick = () => {
        setViewMode("applications");
        setPage(1);
        setSelectedSpecialistUuid("");
        setSearchQuery("");
        setSuccess(null);
        setError(null);
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
            onClick: () => {
                handleOpenModal("profile");
                setSelectedSpecialistUuid("");
                setSearchQuery("");
                setSuccess(null);
                setError(null);
            },
        },
        {
            label: "Создать специалиста",
            icon: <AddCircleIcon sx={{ mr: 1, color: "#283618" }} />,
            onClick: () => {
                handleOpenModal("specialist");
                setSelectedSpecialistUuid("");
                setSearchQuery("");
                setSuccess(null);
                setError(null);
            },
        },
        {
            label: "Мои специалисты",
            icon: <ListIcon sx={{ mr: 1, color: "#283618" }} />,
            onClick: handleSpecialistsClick,
        },
        {
            label: "Мои отклики",
            icon: <BookmarkIcon sx={{ mr: 1, color: "#283618" }} />,
            onClick: handleApplicationsClick,
        },
        {
            label: "Выйти",
            icon: <LogoutIcon sx={{ mr: 1, color: "#283618" }} />,
            onClick: handleLogout,
        },
    ];

    const filteredVacancies = vacancies.filter(
        (vacancy) =>
            vacancy.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vacancy.description
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
    );

    const filteredSpecialists = specialists.filter(
        (specialist) =>
            specialist.position
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            specialist.about_me
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
    );

    const filteredApplications = applications.filter((application) =>
        application.vacancy?.title
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const handleSearch = async () => {
        if (searchQuery.trim() === "") {
            if (viewMode === "vacancies") {
                fetchVacancies(1);
            } else if (viewMode === "specialists") {
                fetchSpecialists(1);
            } else if (viewMode === "applications" && selectedSpecialistUuid) {
                fetchApplications(1, selectedSpecialistUuid);
            }
            return;
        }

        const skip = (page - 1) * limit;
        try {
            let token = localStorage.getItem("access_token");
            let url;

            if (viewMode === "vacancies") {
                url = `http://localhost:8000/v1/vacancies/search?query=${encodeURIComponent(
                    searchQuery
                )}&skip=${skip}&limit=${limit}`;
            } else if (viewMode === "specialists") {
                url = `http://localhost:8000/v1/specialist/search?query=${encodeURIComponent(
                    searchQuery
                )}&skip=${skip}&limit=${limit}`;
            } else if (viewMode === "applications") {
                url = `http://localhost:8000/v1/applications/search?query=${encodeURIComponent(
                    searchQuery
                )}&skip=${skip}&limit=${limit}`;
            }

            let response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(
                    `Ошибка ${response.status}: Не удалось выполнить поиск`
                );
            }

            const data = await response.json();

            if (viewMode === "vacancies") {
                setVacancies(data.Vacancies || []);
                setTotalVacancies(data.Count || 0);
            } else if (viewMode === "specialists") {
                setSpecialists(data.Specialists || []);
                setTotalSpecialists(data.Count || 0);
            } else if (viewMode === "applications") {
                setApplications(data.Applications || []);
                setTotalApplications(data.Count || 0);
            }

            setError(null);
        } catch (err) {
            setError(err.message);
            if (viewMode === "vacancies") {
                setVacancies([]);
                setTotalVacancies(0);
            } else if (viewMode === "specialists") {
                setSpecialists([]);
                setTotalSpecialists(0);
            } else if (viewMode === "applications") {
                setApplications([]);
                setTotalApplications(0);
            }
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchUserData();
            if (viewMode === "vacancies") {
                fetchVacancies(page);
            } else if (viewMode === "specialists") {
                fetchSpecialists(page);
            } else if (viewMode === "applications" && selectedSpecialistUuid) {
                fetchApplications(page, selectedSpecialistUuid);
            }
        } else {
            navigate("/signin");
        }
    }, [isAuthenticated, navigate, page, viewMode, selectedSpecialistUuid]);

    return (
        <Box className={styles.loginBackground}>
            <Header
                user={user}
                to="/usermain"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={handleSearch}
            />
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
                            : viewMode === "specialists"
                            ? "Мои специалисты"
                            : "Мои отклики"}
                    </Typography>
                    {(viewMode === "vacancies" ||
                        viewMode === "applications") && (
                        <FormControl sx={{ mb: 2, minWidth: 200 }}>
                            <InputLabel>Выберите специалиста</InputLabel>
                            <Select
                                value={selectedSpecialistUuid}
                                label="Выберите специалиста"
                                onChange={(e) => {
                                    setSelectedSpecialistUuid(e.target.value);
                                    if (
                                        viewMode === "applications" &&
                                        e.target.value
                                    ) {
                                        fetchApplications(1, e.target.value);
                                    }
                                }}
                            >
                                <MenuItem value="">
                                    <em>Не выбрано</em>
                                </MenuItem>
                                {specialists.map((specialist) => (
                                    <MenuItem
                                        key={specialist.uuid}
                                        value={specialist.uuid}
                                    >
                                        {specialist.position}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {success}
                        </Alert>
                    )}
                    {viewMode === "vacancies" ? (
                        <>
                            {!selectedSpecialistUuid && !error && (
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                >
                                    Выберите специалиста для просмотра вакансий
                                </Typography>
                            )}
                            {selectedSpecialistUuid &&
                                vacancies.length === 0 &&
                                !error && (
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                    >
                                        Нет доступных вакансий
                                    </Typography>
                                )}
                            {selectedSpecialistUuid &&
                                vacancies.map((vacancy) => (
                                    <VacancyCard
                                        key={vacancy.uuid}
                                        vacancy={vacancy}
                                        onApply={createApplication}
                                        specialistUuid={selectedSpecialistUuid}
                                    />
                                ))}
                            {selectedSpecialistUuid &&
                                totalVacancies > limit && (
                                    <PaginationComponent
                                        count={Math.ceil(
                                            totalVacancies / limit
                                        )}
                                        page={page}
                                        onChange={(e, value) => setPage(value)}
                                    />
                                )}
                        </>
                    ) : viewMode === "specialists" ? (
                        <>
                            {filteredSpecialists.length === 0 && !error && (
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                >
                                    Вы пока не создали специалистов
                                </Typography>
                            )}
                            {filteredSpecialists.map((specialist) => (
                                <SpecialistCard
                                    key={specialist.uuid}
                                    specialist={specialist}
                                    onEdit={() =>
                                        handleOpenModal(
                                            "specialist",
                                            specialist
                                        )
                                    }
                                    onAddSkill={addSkill}
                                    onDeleteSkill={deleteSkill}
                                    onAddExperience={addExperience}
                                    onDeleteExperience={deleteExperience}
                                    onDelete={deleteSpecialist}
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
                    ) : (
                        <>
                            {filteredApplications.length === 0 && !error && (
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                >
                                    Нет отправленных откликов
                                </Typography>
                            )}
                            {filteredApplications.map((application) => (
                                <ApplicationCard
                                    key={application.o_id}
                                    application={application}
                                    vacancy={application.vacancy}
                                    onDelete={() =>
                                        handleOpenDeleteDialog(
                                            application.specialist_uuid,
                                            application.vacancy_uuid
                                        )
                                    }
                                />
                            ))}
                            {totalApplications > limit && (
                                <PaginationComponent
                                    count={Math.ceil(totalApplications / limit)}
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
                            onSubmit={
                                selectedSpecialist
                                    ? editSpecialist
                                    : createSpecialist
                            }
                            error={error}
                            success={success}
                            onCancel={handleCloseModal}
                            isEditing={!!selectedSpecialist}
                        />
                    )}
                </Box>
            </Modal>
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="delete-dialog-title"
            >
                <DialogTitle id="delete-dialog-title">
                    Подтверждение удаления
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Вы уверены, что хотите удалить этот отклик?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseDeleteDialog}
                        sx={{ color: "#283618" }}
                    >
                        Отмена
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        variant="contained"
                        sx={{ backgroundColor: "#d32f2f" }}
                    >
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
