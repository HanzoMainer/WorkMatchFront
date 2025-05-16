import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Avatar,
} from "@mui/material";
import { Link } from "react-router-dom";
import styles from "./../hr-main-page/page/style.module.css";

const HrHeader = ({ user, to = "/usermain",}) => {
    return (
        <AppBar
            position="static"
            className={styles.bodyHead}
            style={{ backgroundColor: "#283618" }}
        >
            <Toolbar style={{ backgroundColor: "#283618" }}>
                <Box className={styles.logo}>
                    <Box className={styles.logoContainer}>
                        <Link to={to}>
                            <img
                                src="/Logo.svg"
                                alt="Логотип"
                                className={styles.logoPhoto}
                            />
                        </Link>
                    </Box>
                </Box>
                <Box
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        justifyContent: "center",
                    }}
                ></Box>
                {user && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifySelf: "end",
                        }}
                    >
                        <Avatar sx={{ mr: 1 }}>
                            {user.full_name ? user.full_name[0] : "U"}
                        </Avatar>
                        <Typography className={styles.textStyle}>
                            {user.username}
                        </Typography>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default HrHeader;
