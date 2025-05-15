import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
} from "@mui/material";
import { Info as InfoIcon } from "@mui/icons-material";
import styles from "./../hr-main-page/page/style.module.css";

const VacancyCard = ({ vacancy, onInfoClick, onViewResponses, onApply }) => {
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
                    {vacancy.title}
                </Typography>
                <Typography color="#606c38">{vacancy.description}</Typography>
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
                {onInfoClick && (
                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<InfoIcon />}
                        style={{ backgroundColor: "#283618" }}
                        onClick={() => onInfoClick(vacancy)}
                    >
                        Информация
                    </Button>
                )}
                {onViewResponses && (
                    <Button
                        size="small"
                        variant="outlined"
                        style={{ color: "#283618", borderColor: "#283618" }}
                        onClick={onViewResponses}
                    >
                        Просмотр откликов
                    </Button>
                )}
                {onApply && (
                    <Button
                        size="small"
                        variant="contained"
                        style={{ backgroundColor: "#283618" }}
                        onClick={() => onApply(vacancy)}
                    >
                        Откликнуться
                    </Button>
                )}
            </CardActions>
        </Card>
    );
};

export default VacancyCard;
