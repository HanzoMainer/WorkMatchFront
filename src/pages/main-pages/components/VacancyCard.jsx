import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
} from "@mui/material";
import {
    Info as InfoIcon,
    Bookmark as BookmarkIcon,
    Summarize as SummarizeIcon,
} from "@mui/icons-material";
import styles from "./../hr-main-page/page/style.module.css";

const VacancyCard = ({
    vacancy,
    onInfoClick,
    onViewResponses,
    onApply,
    specialistUuid,
    deleteVacancy,
    onSummaryClick,
}) => {
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
                    Зарплата: {vacancy.salary} ₽
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
                        startIcon={<BookmarkIcon />}
                        style={{ backgroundColor: "#283618" }}
                        onClick={() => onApply(specialistUuid, vacancy.uuid)}
                        disabled={!specialistUuid}
                        sx={{
                            "&.Mui-disabled": {
                                color: "white",
                                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                            },
                            "&:hover": {
                                boxShadow: "0 12px 20px rgba(0, 0, 0, 0.3)",
                                transform: "translateY(-2px)",
                                transition: "all 0.3s ease",
                            },
                            transition: "all 0.3s ease",
                            transform: "translateY(0)",
                        }}
                    >
                        Откликнуться
                    </Button>
                )}
                {deleteVacancy && (
                    <Button
                        size="small"
                        variant="contained"
                        style={{ backgroundColor: "#d32f2f" }}
                        onClick={() => deleteVacancy(vacancy.uuid)}
                    >
                        Удалить
                    </Button>
                )}
                {onSummaryClick && (
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<SummarizeIcon />}
                        onClick={() => onSummaryClick(vacancy.uuid)}
                        sx={{
                            borderColor: "transparent",
                            background: "transparent",
                            color: "#fefae0",
                            backgroundImage:
                                "linear-gradient(45deg, #283618, #606c38, #283618, #606c38)",
                            backgroundSize: "200% 200%",
                            animation: "gradientShift 3s ease infinite",
                            "&:hover": {
                                boxShadow: "0 12px 20px rgba(0, 0, 0, 0.3)",
                                transform: "translateY(-2px)",
                                transition: "all 0.3s ease",
                            },
                            "@keyframes gradientShift": {
                                "0%": { backgroundPosition: "0% 50%" },
                                "50%": { backgroundPosition: "100% 50%" },
                                "100%": { backgroundPosition: "0% 50%" },
                            },
                            "& .MuiButton-label": {
                                background:
                                    "linear-gradient(45deg, #283618, #606c38, #283618, #606c38)",
                                backgroundSize: "200% 200%",
                                animation: "gradientShift 3s ease infinite",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            },
                            transition: "all 0.3s ease",
                        }}
                    >
                        Кратко о вакансии
                    </Button>
                )}
            </CardActions>
        </Card>
    );
};

export default VacancyCard;
