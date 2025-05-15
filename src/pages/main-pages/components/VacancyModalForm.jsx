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

const VacancyModalForm = ({
    vacancyData,
    setVacancyData,
    onSubmit,
    error,
    success,
    onCancel,
}) => {
    return (
        <Box className={styles.modalBox}>
            <Typography variant="h6" gutterBottom>
                Создать вакансию
            </Typography>
            <form onSubmit={onSubmit}>
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
                <FormControl fullWidth>
                    <InputLabel>Тип занятости</InputLabel>
                    <Select
                        value={vacancyData.employment_type_str}
                        label="Тип занятости"
                        onChange={(e) =>
                            setVacancyData({
                                ...vacancyData,
                                employment_type_str: e.target.value,
                            })
                        }
                        required
                    >
                        {employmentTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                                {type.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
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
                        onClick={onCancel}
                        style={{ color: "#283618", borderColor: "#283618" }}
                    >
                        Отмена
                    </Button>
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
            </form>
        </Box>
    );
};

export default VacancyModalForm;
