import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import styles from "./../hr-main-page/page/style.module.css";

const ApplicationCardHR = ({ application, specialist, vacancy }) => {
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
                    Вакансия: {vacancy?.title || "Неизвестная вакансия"}
                </Typography>
                <Typography color="#606c38">
                    Специалист: {specialist?.full_name || "Не указано"}
                </Typography>
                <Typography color="#606c38">
                    Должность: {specialist?.position || "Не указано"}
                </Typography>
                <Typography color="#606c38">
                    О себе: {specialist?.about_me || "Не указано"}
                </Typography>
                <Typography color="#606c38">
                    Тип занятости:{" "}
                    {specialist?.employment_type_str || "Не указано"}
                </Typography>
                <Box sx={{ mt: 1 }}>
                    <Typography color="#606c38" sx={{ mb: 1 }}>
                        Навыки:
                    </Typography>
                    {specialist?.skills && specialist.skills.length > 0 ? (
                        specialist.skills.map((skill, index) => (
                            <Chip
                                key={index}
                                label={skill}
                                size="medium"
                                sx={{
                                    mt: 1,
                                    mr: 1,
                                    backgroundColor: "#e0e0e0",
                                    "& .MuiChip-deleteIcon": {
                                        color: "#283618",
                                    },
                                }}
                            />
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            Навыки не указаны
                        </Typography>
                    )}
                </Box>
                <Box sx={{ mt: 1 }}>
                    <Typography color="#606c38" sx={{ mb: 1 }}>
                        Опыт работы:
                    </Typography>
                    {specialist?.experience &&
                    specialist.experience.length > 0 ? (
                        specialist.experience.map((exp, index) => (
                            <Box key={index} sx={{ mb: 1 }}>
                                <Typography color="#606c38">
                                    Компания: {exp.company || "Не указано"}
                                </Typography>
                                <Typography color="#606c38">
                                    Должность: {exp.position || "Не указано"}
                                </Typography>
                                <Typography color="#606c38">
                                    Период: {exp.start_date || "Не указано"} -{" "}
                                    {exp.end_date || "по настоящее время"}
                                </Typography>
                                <Typography color="#606c38">
                                    Описание: {exp.description || "Не указано"}
                                </Typography>
                            </Box>
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            Опыт работы не указан
                        </Typography>
                    )}
                </Box>
                <Typography color="#606c38">
                    ID отклика: {application.o_id}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ApplicationCardHR;
