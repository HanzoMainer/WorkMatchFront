import { useState } from "react";
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    TextField,
    Box,
    Chip,
    Collapse,
    Grid,
    styled,
} from "@mui/material";
import {
    Edit as EditIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { enGB } from "date-fns/locale";
import styles from "./../hr-main-page/page/style.module.css";

const AnimatedDatePicker = styled(DatePicker)(({ theme }) => ({
    "& .MuiPickersPopper-root": {
        transition: "all 0.3s ease",
        "& .MuiPaper-root": {
            transform: "scale(0.98)",
            transition: "all 0.3s ease",
            opacity: 0,
        },
    },
    '& .MuiPickersPopper-root[role="tooltip"]': {
        "& .MuiPaper-root": {
            transform: "scale(1.02) translateY(-5px)",
            opacity: 1,
            boxShadow: theme.shadows[6],
        },
    },
}));

const employmentTypesMap = {
    "full-time": "Полная занятость",
    "part-time": "Частичная занятость",
};

const formatDateToApi = (date) => {
    if (!date) return null;
    return date.toISOString().split("T")[0];
};

const SpecialistCard = ({
    specialist,
    onEdit,
    onAddSkill,
    onDeleteSkill,
    onAddExperience,
    onDeleteExperience,
    onDelete,
}) => {
    const [isAddingSkill, setIsAddingSkill] = useState(false);
    const [newSkill, setNewSkill] = useState("");
    const [isAddingExperience, setIsAddingExperience] = useState(false);
    const [newExperience, setNewExperience] = useState({
        company_name: "",
        position: "",
        start_date: null,
        end_date: null,
    });

    const handleAddSkill = () => {
        if (newSkill.trim()) {
            onAddSkill(specialist.uuid, newSkill);
            setNewSkill("");
            setIsAddingSkill(false);
        }
    };

    const handleAddExperience = () => {
        if (
            newExperience.company_name.trim() &&
            newExperience.position.trim() &&
            newExperience.start_date &&
            newExperience.end_date
        ) {
            const experienceToSend = {
                company_name: newExperience.company_name,
                position: newExperience.position,
                start_date: formatDateToApi(newExperience.start_date),
                end_date: formatDateToApi(newExperience.end_date),
            };

            onAddExperience(specialist.uuid, experienceToSend);
            setNewExperience({
                company_name: "",
                position: "",
                start_date: null,
                end_date: null,
            });
            setIsAddingExperience(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "Не указано";
        if (
            typeof dateStr === "string" &&
            dateStr.match(/^\d{4}-\d{2}-\d{2}$/)
        ) {
            const [year, month, day] = dateStr.split("-");
            return `${day}.${month}.${year}`;
        }
        const date = new Date(dateStr);
        return date.toLocaleDateString("ru-RU");
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
            <Card
                className={styles.jobCard}
                sx={{
                    transition: "all 0.3s ease",
                    "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                        cursor: "pointer",
                    },
                }}
            >
                <CardContent>
                    <Typography variant="h6" color="#283618">
                        {specialist.position}
                    </Typography>
                    <Typography color="#606c38">
                        О себе: {specialist.about_me}
                    </Typography>
                    <Typography color="#606c38">
                        Тип занятости:{" "}
                        {employmentTypesMap[specialist.employment_type_str] ||
                            specialist.employment_type_str}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                        <Typography color="#606c38" sx={{ mb: 1 }}>
                            Навыки:
                        </Typography>
                        {specialist.skills && specialist.skills.length > 0 ? (
                            specialist.skills.map((skill, index) => (
                                <Chip
                                    key={index}
                                    label={skill}
                                    size="big"
                                    onDelete={() =>
                                        onDeleteSkill(specialist.uuid, skill)
                                    }
                                    sx={{
                                        mt: 1,
                                        mr: 1,
                                        backgroundColor: "#e0e0e0",
                                    }}
                                />
                            ))
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                Навыки не указаны
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography color="#606c38" sx={{ mb: 1 }}>
                            Опыт работы:
                        </Typography>
                        {specialist.experiences &&
                        specialist.experiences.length > 0 ? (
                            specialist.experiences.map((exp, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        mb: 1,
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography
                                            variant="body2"
                                            color="#283618"
                                        >
                                            {exp.company_name} - {exp.position}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="#606c38"
                                        >
                                            {formatDate(exp.start_date)} -{" "}
                                            {formatDate(exp.end_date)}
                                        </Typography>
                                    </Box>
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() =>
                                            onDeleteExperience(
                                                specialist.uuid,
                                                exp.uuid
                                            )
                                        }
                                    >
                                        <DeleteIcon />
                                    </Button>
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                Опыт работы не указан
                            </Typography>
                        )}
                    </Box>
                </CardContent>
                <CardActions>
                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<EditIcon />}
                        style={{ backgroundColor: "#283618" }}
                        onClick={() => onEdit(specialist)}
                    >
                        Редактировать
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<AddIcon />}
                        style={{ color: "#283618", borderColor: "#283618" }}
                        onClick={() => setIsAddingSkill(!isAddingSkill)}
                    >
                        {isAddingSkill ? "Отмена" : "Добавить навык"}
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<AddIcon />}
                        style={{ color: "#283618", borderColor: "#283618" }}
                        onClick={() =>
                            setIsAddingExperience(!isAddingExperience)
                        }
                    >
                        {isAddingExperience ? "Отмена" : "Добавить опыт"}
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        sx={{
                            backgroundColor: "#d32f2f",
                            gap: 1,
                            color: "white",
                            borderColor: "#d32f2f",
                        }}
                        onClick={() => onDelete(specialist.uuid)}
                    >
                        Удалить специалиста
                    </Button>
                </CardActions>
                <Collapse in={isAddingSkill}>
                    <Box sx={{ p: 2 }}>
                        <TextField
                            label="Новый навык"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            fullWidth
                            size="small"
                            sx={{ mb: 1 }}
                        />
                        <Button
                            size="small"
                            variant="contained"
                            style={{ backgroundColor: "#283618" }}
                            onClick={handleAddSkill}
                            disabled={!newSkill.trim()}
                            sx={{
                                "&.Mui-disabled": {
                                    color: "white",
                                },
                            }}
                        >
                            Сохранить
                        </Button>
                    </Box>
                </Collapse>
                <Collapse in={isAddingExperience}>
                    <Box sx={{ p: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Название компании"
                                    value={newExperience.company_name}
                                    onChange={(e) =>
                                        setNewExperience({
                                            ...newExperience,
                                            company_name: e.target.value,
                                        })
                                    }
                                    fullWidth
                                    size="small"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Должность"
                                    value={newExperience.position}
                                    onChange={(e) =>
                                        setNewExperience({
                                            ...newExperience,
                                            position: e.target.value,
                                        })
                                    }
                                    fullWidth
                                    size="small"
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <AnimatedDatePicker
                                    label="Дата начала"
                                    value={newExperience.start_date}
                                    onChange={(newValue) =>
                                        setNewExperience({
                                            ...newExperience,
                                            start_date: newValue,
                                        })
                                    }
                                    format="dd/MM/yyyy"
                                    slotProps={{
                                        textField: {
                                            size: "small",
                                            fullWidth: true,
                                            required: true,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <AnimatedDatePicker
                                    label="Дата окончания"
                                    value={newExperience.end_date}
                                    onChange={(newValue) =>
                                        setNewExperience({
                                            ...newExperience,
                                            end_date: newValue,
                                        })
                                    }
                                    format="dd/MM/yyyy"
                                    slotProps={{
                                        textField: {
                                            size: "small",
                                            fullWidth: true,
                                            required: true,
                                        },
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            size="small"
                            variant="contained"
                            style={{ backgroundColor: "#283618" }}
                            onClick={handleAddExperience}
                            disabled={
                                !newExperience.company_name.trim() ||
                                !newExperience.position.trim() ||
                                !newExperience.start_date ||
                                !newExperience.end_date
                            }
                            sx={{
                                mt: 2,
                                "&.Mui-disabled": {
                                    color: "white",
                                },
                            }}
                        >
                            Сохранить
                        </Button>
                    </Box>
                </Collapse>
            </Card>
        </LocalizationProvider>
    );
};

export default SpecialistCard;
