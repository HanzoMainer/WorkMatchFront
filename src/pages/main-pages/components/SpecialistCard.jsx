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
} from "@mui/material";
import { Edit as EditIcon, Add as AddIcon } from "@mui/icons-material";
import styles from "./../hr-main-page/page/style.module.css";
    
const employmentTypesMap = {
    "full-time": "Полная занятость",
    "part-time": "Частичная занятость",
};

const SpecialistCard = ({ specialist, onEdit, onAddSkill, onDeleteSkill }) => {
    const [isAddingSkill, setIsAddingSkill] = useState(false);
    const [newSkill, setNewSkill] = useState("");

    const handleAddSkill = () => {
        if (newSkill.trim()) {
            onAddSkill(specialist.uuid, newSkill);
            setNewSkill("");
            setIsAddingSkill(false);
        }
    };

    return (
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
                            '&.Mui-disabled': {
                                color: 'white',
                            },
                        }}
                    >
                        Сохранить
                    </Button>
                </Box>
            </Collapse>
        </Card>
    );
};

export default SpecialistCard;
