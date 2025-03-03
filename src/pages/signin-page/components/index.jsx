import styles from "./style.module.css";
import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";

export function SignBack() {
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => event.preventDefault();
    const handleMouseUpPassword = (event) => event.preventDefault();

    return (
        <>
            <div className={styles.loginBackground}>
                <div className={styles.loginContainer}>
                    <div className={styles.logoContainer}>
                        <img src="/Logo.svg" alt="Логотип" />
                    </div>
                </div>
                <div className={styles.bodyHead}>
                    <div className={styles.mainLogin}>
                        <span className={styles.reg}>Вход</span>
                        <span className={styles.regSub}>С возвращением</span>
                    </div>
                </div>
                <div className={styles.bodyLeg}>
                    <div className={styles.subLogin}>
                        <div className={styles.buttonContainer}>
                            <div className={styles.button}>
                                <Box
                                    component="form"
                                    sx={{
                                        "& > :not(style)": {
                                            m: 1,
                                            width: {
                                                xs: "100%",
                                                sm: "80%",
                                                md: "60%",
                                                lg: "46%",
                                            },
                                            backgroundColor: "white",
                                            borderRadius: "10px",
                                            fontSize: "18px",
                                        },
                                    }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <TextField
                                        label="Имя пользователя"
                                        variant="outlined"
                                        color="#606C38"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                fontSize: "20px",
                                                borderRadius: "10px",
                                                padding: "3px",
                                            },
                                            "& .MuiInputLabel-root": {
                                                fontFamily:
                                                    '"Roboto", sans-serif',
                                                fontSize: "20px",
                                            },
                                        }}
                                    />
                                </Box>
                            </div>
                            <div className={styles.button}>
                                <Box
                                    component="form"
                                    sx={{
                                        "& > :not(style)": {
                                            m: 1,
                                            width: {
                                                xs: "100%",
                                                sm: "80%",
                                                md: "60%",
                                                lg: "46%",
                                            },
                                            backgroundColor: "white",
                                        },
                                    }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <FormControl
                                        sx={{
                                            width: "100%",
                                            "& .MuiOutlinedInput-root": {
                                                fontSize: "20px",
                                                borderRadius: "10px",
                                                padding: "3px",
                                            },
                                            "& .MuiInputLabel-root": {
                                                fontFamily:
                                                    '"Roboto", sans-serif',
                                                fontSize: "20px",
                                            },
                                        }}
                                        variant="outlined"
                                        color="#606C38"
                                    >
                                        <InputLabel htmlFor="outlined-adornment-password">
                                            Пароль
                                        </InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            endAdornment={
                                                <InputAdornment position="start">
                                                    <IconButton
                                                        aria-label={
                                                            showPassword
                                                                ? "Скрыть пароль"
                                                                : "Показать пароль"
                                                        }
                                                        onClick={
                                                            handleClickShowPassword
                                                        }
                                                        onMouseDown={
                                                            handleMouseDownPassword
                                                        }
                                                        onMouseUp={
                                                            handleMouseUpPassword
                                                        }
                                                        edge="end"
                                                    >
                                                        {showPassword ? (
                                                            <VisibilityOff />
                                                        ) : (
                                                            <Visibility />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Пароль"
                                        />
                                    </FormControl>
                                </Box>
                            </div>
                            <div
                                className={styles.checkboxContainer}
                                sx={{
                                    width: {
                                        xs: "100%",
                                        sm: "80%",
                                        md: "60%",
                                        lg: "46%",
                                    },
                                }}
                            >
                                <FormGroup className={styles.checkbox}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                sx={{
                                                    color: "#606C38",
                                                    "&.Mui-checked": {
                                                        color: "#606C38",
                                                    },
                                                }}
                                            />
                                        }
                                        label="Запомнить данные"
                                        sx={{
                                            "& .MuiFormControlLabel-label": {
                                                fontFamily:
                                                    '"Roboto", sans-serif',
                                                fontSize: "20px",
                                                opacity: "60%",
                                            },
                                        }}
                                    />
                                </FormGroup>
                            </div>
                            <div className={styles.loginButton}>
                                <Stack>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            alignSelf: "center",
                                            backgroundColor: "#606C38",
                                            "&:hover": {
                                                backgroundColor: "#4F5A2E",
                                            },
                                            height: "6vh",
                                            fontFamily: '"Roboto", sans-serif',
                                            fontSize: "20px",
                                            marginTop: "2vh",
                                            width: {
                                                xs: "100%",
                                                sm: "80%",
                                                md: "60%",
                                                lg: "46%",
                                            },
                                        }}
                                    >
                                        Продолжить
                                    </Button>
                                </Stack>
                            </div>
                            <div className={styles.already}>
                                <Link
                                    to="/login"
                                    style={{
                                        textDecoration: "none",
                                        color: "black",
                                    }}
                                >
                                    Нет аккаунта?
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
