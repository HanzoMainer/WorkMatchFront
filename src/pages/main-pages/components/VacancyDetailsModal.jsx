import {
    TextField,
    Button,
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
} from "@mui/material";
import styles from "./../hr-main-page/page/style.module.css";

const employmentTypes = [
    { value: "full-time", label: "Полная занятость" },
    { value: "part-time", label: "Частичная занятость" },
];

const VacancyDetailsModal = ({
    selectedVacancy,
    isEditing,
    vacancyData,
    setVacancyData,
    onSave,
    onEdit,
    onCancelEdit,
    onClose,
    error,
    success,
}) => {
    return (
        <Box className={styles.modalBox}>
            <Typography variant="h6" gutterBottom>
                Информация о вакансии
            </Typography>
            <TextField
                label="Название вакансии"
                value={selectedVacancy.title}
                fullWidth
                margin="normal"
                disabled
            />
            <TextField
                label="Описание"
                value={
                    isEditing
                        ? vacancyData.description
                        : selectedVacancy.description
                }
                onChange={(e) =>
                    isEditing &&
                    setVacancyData({
                        ...vacancyData,
                        description: e.target.value,
                    })
                }
                fullWidth
                margin="normal"
                multiline
                rows={4}
                disabled={!isEditing}
            />
            <TextField
                label="Требования"
                value={
                    isEditing
                        ? vacancyData.requirements
                        : selectedVacancy.requirements
                }
                onChange={(e) =>
                    isEditing &&
                    setVacancyData({
                        ...vacancyData,
                        requirements: e.target.value,
                    })
                }
                fullWidth
                margin="normal"
                multiline
                rows={4}
                disabled={!isEditing}
            />
            <TextField
                label="Условия"
                value={
                    isEditing
                        ? vacancyData.conditions
                        : selectedVacancy.conditions
                }
                onChange={(e) =>
                    isEditing &&
                    setVacancyData({
                        ...vacancyData,
                        conditions: e.target.value,
                    })
                }
                fullWidth
                margin="normal"
                multiline
                rows={4}
                disabled={!isEditing}
            />
            <TextField
                label="Зарплата"
                value={isEditing ? vacancyData.salary : selectedVacancy.salary}
                onChange={(e) =>
                    isEditing &&
                    setVacancyData({ ...vacancyData, salary: e.target.value })
                }
                fullWidth
                margin="normal"
                disabled={!isEditing}
            />
            <FormControl fullWidth margin="normal" disabled={!isEditing}>
                <InputLabel>Тип занятости</InputLabel>
                <Select
                    value={
                        (isEditing
                            ? vacancyData.employment_type
                            : selectedVacancy.employment_type) || ""
                    }
                    label="Тип занятости"
                    onChange={(e) =>
                        isEditing &&
                        setVacancyData({
                            ...vacancyData,
                            employment_type: e.target.value,
                        })
                    }
                >
                    {employmentTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                            {type.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                {isEditing ? (
                    <>
                        <Button
                            variant="contained"
                            style={{ backgroundColor: "#283618" }}
                            onClick={onSave}
                        >
                            Сохранить
                        </Button>
                        <Button
                            variant="outlined"
                            style={{ color: "#283618", borderColor: "#283618" }}
                            onClick={onCancelEdit}
                        >
                            Отмена
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            variant="outlined"
                            style={{ color: "#283618", borderColor: "#283618" }}
                            onClick={onClose}
                        >
                            Закрыть
                        </Button>
                        <Button
                            variant="contained"
                            style={{ backgroundColor: "#283618" }}
                            onClick={onEdit}
                        >
                            Редактировать
                        </Button>
                    </>
                )}
            </Box>
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
    );
};

export default VacancyDetailsModal;
