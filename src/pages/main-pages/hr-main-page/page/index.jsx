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
} from "@mui/material";
import { AuthContext } from "../../../../context/AuthContext";
import styles from "./style.module.css";
import HrHeader from "../../components/HrHeader";
import Sidebar from "../../components/Sidebar";
import VacancyCard from "../../components/VacancyCard";
import ApplicationCardHR from "../../components/ApplicationCardHR";
import ProfileModalForm from "../../components/ProfileModalForm";
import VacancyModalForm from "../../components/VacancyModalForm";
import VacancyDetailsModal from "../../components/VacancyDetailsModal";
import AnalysisModal from "../../components/AnalysisModal";
import PaginationComponent from "../../components/PaginationComponent";
import {
    Home as HomeIcon,
    Person as PersonIcon,
    Logout as LogoutIcon,
    AddCircle as AddCircleIcon,
    List as ListIcon,
    Bookmark as BookmarkIcon,
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
    const [selectedVacancyUuid, setSelectedVacancyUuid] = useState("");
    const [vacancies, setVacancies] = useState([]);
    const [applications, setApplications] = useState([]);
    const [totalVacancies, setTotalVacancies] = useState(0);
    const [totalApplications, setTotalApplications] = useState(0);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState("profile");
    const [page, setPage] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const [viewMode, setViewMode] = useState("vacancies");
    const [analysisData, setAnalysisData] = useState(null);
    const [openAnalysisModal, setOpenAnalysisModal] = useState(false);
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
            fetchVacancies(1);
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

    const fetchApplicationsByVacancy = async (pageNum, vacancyUuid) => {
        try {
            const skip = (pageNum - 1) * limit;
            let token = localStorage.getItem("access_token");
            let response = await fetch(
                `http://localhost:8000/v1/applications/vacancy/${vacancyUuid}?skip=${skip}&limit=${limit}`,
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
            console.log("Applications fetched:", applicationsArray);
            const total = data.applications?.length || 0;

            const specialistsData = await Promise.all(
                applicationsArray.map(async (app) => {
                    let specResponse = await fetch(
                        `http://localhost:8000/v1/specialist/${app.specialist_uuid}`,
                        {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    return specResponse.ok ? await specResponse.json() : null;
                })
            );

            const vacancy =
                vacancies.find((v) => v.uuid === vacancyUuid) ||
                (await fetch(
                    `http://localhost:8000/v1/vacancies/${vacancyUuid}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                ).then((res) => (res.ok ? res.json() : null)));

            setApplications(
                applicationsArray.map((app, index) => ({
                    ...app,
                    specialist: specialistsData[index],
                    vacancy,
                }))
            );
            setTotalApplications(total);
            setError(null);
        } catch (err) {
            setError(err.message);
            setApplications([]);
        }
    };

    const fetchAnalysis = async (specialistUuid, vacancyUuid) => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(
                `http://localhost:8000/v1/analyse/${specialistUuid}/${vacancyUuid}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }
            );
            if (!response.ok) {
                throw new Error(
                    `Ошибка ${response.status}: Не удалось получить аналитику`
                );
            }
            const data = await response.json();
            return data;
        } catch (err) {
            setError(err.message);
            return null;
        }
    };

    const handleViewAnalysis = async (specialistUuid, vacancyUuid) => {
        const data = await fetchAnalysis(specialistUuid, vacancyUuid);
        if (data) {
            setAnalysisData(data);
            setOpenAnalysisModal(true);
        } else {
            console.log("No data returned from fetchAnalysis");
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
        setApplications([]);
        setTotalApplications(0);
        setSelectedVacancyUuid("");
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
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.message);
            setSuccess(null);
        }
    };

    const deleteVacancy = async (vacancyUuid) => {
        try {
            let token = localStorage.getItem("access_token");
            let response = await fetch(
                `http://localhost:8000/v1/vacancies/${vacancyUuid}`,
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
                    `Ошибка ${response.status}: Не удалось удалить вакансию`
                );
            }
            setSuccess("Вакансия успешно удалена");
            setError(null);
            fetchVacancies(page);
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.message);
            setSuccess(null);
        }
    };

    const handleSaveChanges = async () => {
        try {
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
                        title: vacancyData.title,
                        description: vacancyData.description,
                        requirements: vacancyData.requirements,
                        conditions: vacancyData.conditions,
                        salary: salary,
                        employment_type_str: vacancyData.employment_type_str,
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
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogout = () => {
        clearUserData();
        logout();
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/signin");
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
            employment_type_str: selectedVacancy.employment_type_str || "",
        });
    };

    const handleHomeClick = () => {
        setViewMode("vacancies");
        clearVacancies();
        setSuccess(null);
        setError(null);
        navigate("/hrmain");
    };

    const handleVacanciesClick = () => {
        setViewMode("vacancies");
        fetchVacancies(1);
        setSuccess(null);
        setError(null);
    };

    const handleApplicationsClick = () => {
        setViewMode("applications");
        setPage(1);
        setApplications([]);
        setSelectedVacancyUuid("");
        setSuccess(null);
        setError(null);
    };

    const handleViewResponses = (vacancyUuid) => {
        setViewMode("applications");
        setSelectedVacancyUuid(vacancyUuid);
        setPage(1);
        fetchApplicationsByVacancy(1, vacancyUuid);
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
                setSuccess(null);
                setError(null);
            },
        },
        {
            label: "Создать вакансию",
            icon: <AddCircleIcon sx={{ mr: 1, color: "#283618" }} />,
            onClick: () => {
                handleOpenModal("vacancy");
                setSuccess(null);
                setError(null);
            },
        },
        {
            label: "Мои вакансии",
            icon: <ListIcon sx={{ mr: 1, color: "#283618" }} />,
            onClick: handleVacanciesClick,
        },
        {
            label: "Отклики",
            icon: <BookmarkIcon sx={{ mr: 1, color: "#283618" }} />,
            onClick: handleApplicationsClick,
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

    useEffect(() => {
        if (viewMode === "vacancies") {
            fetchVacancies(page);
        } else if (viewMode === "applications" && selectedVacancyUuid) {
            fetchApplicationsByVacancy(page, selectedVacancyUuid);
        }
    }, [page, viewMode, selectedVacancyUuid]);

    return (
        <Box className={styles.loginBackground}>
            <HrHeader user={user} to="/hrmain" />
            <Box className={styles.bodyLeg}>
                <Sidebar items={sidebarItems} />
                <Box className={styles.jobList}>
                    <Typography
                        variant="h4"
                        className={styles.font1}
                        gutterBottom
                    >
                        {viewMode === "vacancies"
                            ? "Мои вакансии"
                            : "Отклики на вакансии"}
                    </Typography>
                    {viewMode === "applications" && (
                        <FormControl sx={{ mb: 2, minWidth: 200 }}>
                            <InputLabel>Выберите вакансию</InputLabel>
                            <Select
                                value={selectedVacancyUuid}
                                label="Выберите вакансию"
                                onChange={(e) => {
                                    setSelectedVacancyUuid(e.target.value);
                                    if (e.target.value) {
                                        fetchApplicationsByVacancy(
                                            1,
                                            e.target.value
                                        );
                                    } else {
                                        setApplications([]);
                                        setTotalApplications(0);
                                    }
                                }}
                            >
                                <MenuItem value="">
                                    <em>Не выбрано</em>
                                </MenuItem>
                                {vacancies.map((vacancy) => (
                                    <MenuItem
                                        key={vacancy.uuid}
                                        value={vacancy.uuid}
                                    >
                                        {vacancy.title}
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
                            {vacancies.length === 0 && !error && (
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                >
                                    Нажмите "Мои вакансии" для просмотра
                                </Typography>
                            )}
                            {vacancies.map((vacancy) => (
                                <VacancyCard
                                    key={vacancy.uuid}
                                    vacancy={vacancy}
                                    onInfoClick={() =>
                                        handleOpenModal(
                                            "vacancyDetails",
                                            vacancy
                                        )
                                    }
                                    onViewResponses={() =>
                                        handleViewResponses(vacancy.uuid)
                                    }
                                    deleteVacancy={deleteVacancy}
                                />
                            ))}
                            {totalVacancies > 0 && (
                                <PaginationComponent
                                    count={Math.ceil(totalVacancies / limit)}
                                    page={page}
                                    onChange={(e, value) => setPage(value)}
                                />
                            )}
                        </>
                    ) : (
                        <>
                            {applications.length === 0 && !error && (
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                >
                                    Нет откликов на выбранную вакансию
                                </Typography>
                            )}
                            {applications.map((application) => (
                                <ApplicationCardHR
                                    key={application.o_id}
                                    application={application}
                                    specialist={application.specialist}
                                    vacancy={application.vacancy}
                                    onViewAnalysis={handleViewAnalysis}
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
                    {modalType === "vacancy" && (
                        <VacancyModalForm
                            vacancyData={vacancyData}
                            setVacancyData={setVacancyData}
                            onSubmit={createVacancy}
                            error={error}
                            success={success}
                            onCancel={handleCloseModal}
                            employmentTypes={employmentTypes}
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
            <AnalysisModal
                open={openAnalysisModal}
                onClose={() => setOpenAnalysisModal(false)}
                analysisData={analysisData}
                error={error}
            />
        </Box>
    );
}
