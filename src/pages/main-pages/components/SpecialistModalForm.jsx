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

const SpecialistModalForm = ({
    specialistData,
    setSpecialistData,
    onSubmit,
    error,
    success,
    onCancel,
    isEditing = false,
}) => {
    return (
        <Box className={styles.modalBox}>
            <Typography variant="h6" gutterBottom>
                {isEditing
                    ? "Редактировать специалиста"
                    : "Создать специалиста"}
            </Typography>
            <form onSubmit={onSubmit}>
                <TextField
                    label="Должность"
                    value={specialistData.position}
                    onChange={(e) =>
                        setSpecialistData({
                            ...specialistData,
                            position: e.target.value,
                        })
                    }
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="О себе"
                    value={specialistData.about_me}
                    onChange={(e) =>
                        setSpecialistData({
                            ...specialistData,
                            about_me: e.target.value,
                        })
                    }
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    required
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Тип занятости</InputLabel>
                    <Select
                        value={specialistData.employment_type_str}
                        label="Тип занятости"
                        onChange={(e) =>
                            setSpecialistData({
                                ...specialistData,
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
                        {isEditing ? "Сохранить" : "Создать"}
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

export default SpecialistModalForm;
