import { Card, CardContent, Typography } from "@mui/material";
import styles from "./../hr-main-page/page/style.module.css";

const SpecialistCard = ({ specialist }) => {
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
                    Тип занятости: {specialist.employment_type}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default SpecialistCard;
