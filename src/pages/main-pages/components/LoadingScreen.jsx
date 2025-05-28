import { Box, CircularProgress, Typography } from "@mui/material";
import styles from "./../hr-main-page/page/style.module.css";

const LoadingScreen = () => (
    <Box
        sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1300,
        }}
    >
        <Box
            sx={{
                textAlign: "center",
                backgroundColor: "white",
                borderRadius: 2,
                p: 4,
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
            }}
        >
            <CircularProgress sx={{ color: "#283618" }} />
            <Typography
                sx={{ color: "#283618", mt: 2 }}
                className={styles.textStyle}
            >
                Загрузка краткой информации...
            </Typography>
        </Box>
    </Box>
);

export default LoadingScreen;
