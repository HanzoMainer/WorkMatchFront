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
                    {specialist?.experiences &&
                    specialist.experiences.length > 0 ? (
                        specialist.experiences.map((exp) => (
                            <Box key={exp.uuid} sx={{ mb: 2 }}>
                                <Typography color="#606c38">
                                    Компания: {exp.company_name || "Не указано"}
                                </Typography>
                                <Typography color="#606c38">
                                    Должность: {exp.position || "Не указано"}
                                </Typography>
                                <Typography color="#606c38">
                                    Период:{" "}
                                    {exp.start_date
                                        ? new Date(
                                              exp.start_date
                                          ).toLocaleDateString("ru-RU", {
                                              month: "long",
                                              year: "numeric",
                                          })
                                        : "Не указано"}{" "}
                                    -{" "}
                                    {exp.end_date
                                        ? new Date(
                                              exp.end_date
                                          ).toLocaleDateString("ru-RU", {
                                              month: "long",
                                              year: "numeric",
                                          })
                                        : "по настоящее время"}
                                </Typography>
                            </Box>
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            Опыт работы не указан
                        </Typography>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default ApplicationCardHR;
