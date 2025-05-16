import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Avatar,
    TextField,
    InputAdornment,
} from "@mui/material";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./../hr-main-page/page/style.module.css";

const Header = ({ user, to = "/usermain", searchQuery, setSearchQuery }) => {
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
                >
                    <TextField
                        variant="outlined"
                        placeholder="Поиск..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: "#606c38" }} />
                                </InputAdornment>
                            ),
                            classes: {
                                root: styles.textStyle,
                            },
                        }}
                        sx={{
                            mt: 3,
                            width: "50%",
                            "& .MuiOutlinedInput-root": {
                                backgroundColor: "#fefae0",
                                color: "#283618",
                                "& fieldset": {
                                    borderColor: "#606c38",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#283618",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#283618",
                                },
                            },
                            "& .MuiInputBase-input": {
                                padding: "8px 14px",
                            },
                        }}
                    />
                </Box>
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

export default Header;
