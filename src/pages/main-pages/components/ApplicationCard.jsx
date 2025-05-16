import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import styles from "./../hr-main-page/page/style.module.css";

const ApplicationCard = ({ application, vacancy, onDelete }) => {
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
                    Зарплата: {vacancy?.salary || "Не указано"}
                </Typography>
                <Typography color="#606c38">
                    ID отклика: {application.o_id}
                </Typography>
                <Typography color="#606c38">
                    Специалист UUID: {application.specialist_uuid}
                </Typography>
                <Typography color="#606c38">
                    Вакансия UUID: {application.vacancy_uuid}
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: "#d32f2f" }}
                        onClick={onDelete}
                    >
                        Удалить отклик
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ApplicationCard;
