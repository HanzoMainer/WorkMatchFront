import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Modal, Alert, Typography } from "@mui/material";
import { AuthContext } from "../../../../context/AuthContext";
import styles from "./style.module.css";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import VacancyCard from "../../components/VacancyCard";
import ProfileModalForm from "../../components/ProfileModalForm";
import VacancyModalForm from "../../components/VacancyModalForm";
import VacancyDetailsModal from "../../components/VacancyDetailsModal";
import PaginationComponent from "../../components/PaginationComponent";
import {
    Home as HomeIcon,
    Person as PersonIcon,
    Logout as LogoutIcon,
    AddCircle as AddCircleIcon,
    List as ListIcon,
} from "@mui/icons-material";

export function HRMainBack() {
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
    const [vacancyData, setVacancyData] = useState({
        title: "",
        description: "",
        requirements: "",
        conditions: "",
        salary: "",
        employment_type_str: "",
    });
    const [selectedVacancy, setSelectedVacancy] = useState(null);
    const [vacancies, setVacancies] = useState([]);
    const [totalVacancies, setTotalVacancies] = useState(0);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState("profile");
    const [page, setPage] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const limit = 5;

    const employmentTypes = [
        { value: "full-time", label: "Полная занятость" },
        { value: "part-time", label: "Частичная занятость" },
    ];

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

    const fetchVacancies = async (pageNum) => {
        try {
            const skip = (pageNum - 1) * limit;
            let token = localStorage.getItem("access_token");
            if (!token) {
                throw new Error("Токен не найден. Пожалуйста, войдите снова.");
            }
            let response = await fetch(
                `http://localhost:8000/v1/vacancies/get_my?skip=${skip}&limit=${limit}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                throw new Error(`Нет созданных Вами вакансий.`);
            }
            const data = await response.json();
            const vacanciesArray = data.Vacancies || [];
            const total = data.Count || 0;
            setVacancies(vacanciesArray);
            setPage(pageNum);
            setTotalVacancies(total);
            setError(null);
        } catch (err) {
            setError(err.message);
            setVacancies([]);
            if (err.message.includes("Токен")) {
                logout();
                navigate("/signin");
            }
        }
    };

    const clearVacancies = () => {
        setVacancies([]);
        setTotalVacancies(0);
        setPage(1);
        setError(null);
    };

    const clearUserData = () => {
        setUser(null);
        setEditData({ full_name: "", email: "", username: "" });
        clearVacancies();
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

    const createVacancy = async (e) => {
        e.preventDefault();
        try {
            if (!vacancyData.description)
                throw new Error("Описание обязательно");
            if (!vacancyData.requirements)
                throw new Error("Требования обязательны");
            if (!vacancyData.conditions) throw new Error("Условия обязательны");
            const salary = parseInt(vacancyData.salary, 10);
            if (isNaN(salary) || salary < 1)
                throw new Error("Зарплата должна быть положительным числом");
            const payload = {
                title: vacancyData.title,
                description: vacancyData.description,
                requirements: vacancyData.requirements,
                conditions: vacancyData.conditions,
                salary,
                employment_type_str: vacancyData.employment_type_str,
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
            fetchVacancies(page);
        } catch (err) {
            setError(err.message);
            setSuccess(null);
        }
    };

    const handleLogout = () => {
        clearUserData();
        logout();
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/signin");
    };

    const handleSaveChanges = async () => {
        try {
            if (!vacancyData.description)
                throw new Error("Описание обязательно");
            if (!vacancyData.requirements)
                throw new Error("Требования обязательны");
            if (!vacancyData.conditions) throw new Error("Условия обязательны");
            const salary = parseInt(vacancyData.salary, 10);
            if (isNaN(salary) || salary < 1)
                throw new Error("Зарплата должна быть положительным числом");
            const token = localStorage.getItem("access_token");
            const response = await fetch(
                `http://localhost:8000/v1/vacancies/edit/${selectedVacancy.uuid}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        description: vacancyData.description,
                        requirements: vacancyData.requirements,
                        conditions: vacancyData.conditions,
                        salary: salary,
                        employment_type_str: vacancyData.employment_type,
                    }),
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.detail || "Ошибка при обновлении вакансии"
                );
            }
            setSuccess("Вакансия успешно обновлена");
            setIsEditing(false);
            fetchVacancies(page);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleOpenModal = (type, vacancy = null) => {
        setModalType(type);
        setSelectedVacancy(vacancy);
        setOpenModal(true);
        setIsEditing(false);
        setError(null);
        setSuccess(null);
        if (type !== "vacancyDetails") {
            setVacancyData({
                title: "",
                description: "",
                requirements: "",
                conditions: "",
                salary: "",
                employment_type_str: "",
            });
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedVacancy(null);
        setIsEditing(false);
        setError(null);
        setSuccess(null);
        setVacancyData({
            title: "",
            description: "",
            requirements: "",
            conditions: "",
            salary: "",
            employment_type_str: "",
        });
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setVacancyData({
            title: selectedVacancy.title || "",
            description: selectedVacancy.description || "",
            requirements: selectedVacancy.requirements || "",
            conditions: selectedVacancy.conditions || "",
            salary: selectedVacancy.salary
                ? selectedVacancy.salary.toString()
                : "",
            employment_type: selectedVacancy.employment_type || "",
        });
    };

    const handleHomeClick = () => {
        clearVacancies();
        navigate("/hrmain");
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
            label: "Создать вакансию",
            icon: <AddCircleIcon sx={{ mr: 1, color: "#283618" }} />,
            onClick: () => handleOpenModal("vacancy"),
        },
        {
            label: "Мои вакансии",
            icon: <ListIcon sx={{ mr: 1, color: "#283618" }} />,
            onClick: () => fetchVacancies(page),
        },
        {
            label: "Выйти",
            icon: <LogoutIcon sx={{ mr: 1, color: "#283618" }} />,
            onClick: handleLogout,
        },
    ];

    useEffect(() => {
        if (isAuthenticated) {
            clearUserData();
            fetchUserData();
        } else {
            clearUserData();
            navigate("/signin");
        }
    }, [isAuthenticated, navigate]);

    return (
        <Box className={styles.loginBackground}>
            <Header user={user} to="/hrmain" />
            <Box className={styles.bodyLeg}>
                <Sidebar items={sidebarItems} />
                <Box className={styles.jobList}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {vacancies.length === 0 && !error && (
                        <Typography variant="body1" color="text.secondary">
                            Нажмите "Мои вакансии" для просмотра
                        </Typography>
                    )}
                    {vacancies.map((vacancy) => (
                        <VacancyCard
                            key={vacancy.uuid}
                            vacancy={vacancy}
                            onInfoClick={() =>
                                handleOpenModal("vacancyDetails", vacancy)
                            }
                            onViewResponses={() =>
                                console.log("View responses")
                            } // Замените на реальную функцию
                        />
                    ))}
                    {totalVacancies > 0 && (
                        <PaginationComponent
                            count={Math.ceil(totalVacancies / limit)}
                            page={page}
                            onChange={(e, value) => {
                                setPage(value);
                                fetchVacancies(value);
                            }}
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
                            passwordData={passwordData}
                            setPasswordData={setPasswordData}
                            onSubmitProfile={updateProfile}
                            onSubmitPassword={changePassword}
                            error={error}
                            success={success}
                            onCancel={handleCloseModal}
                        />
                    )}
                    {modalType === "vacancy" && (
                        <VacancyModalForm
                            vacancyData={vacancyData}
                            setVacancyData={setVacancyData}
                            onSubmit={createVacancy}
                            error={error}
                            success={success}
                            onCancel={handleCloseModal}
                        />
                    )}
                    {modalType === "vacancyDetails" && selectedVacancy && (
                        <VacancyDetailsModal
                            selectedVacancy={selectedVacancy}
                            isEditing={isEditing}
                            vacancyData={vacancyData}
                            setVacancyData={setVacancyData}
                            onSave={handleSaveChanges}
                            onEdit={handleEditClick}
                            onCancelEdit={() => setIsEditing(false)}
                            onClose={handleCloseModal}
                            error={error}
                            success={success}
                            employmentTypes={employmentTypes}
                        />
                    )}
                </Box>
            </Modal>
        </Box>
    );
}
