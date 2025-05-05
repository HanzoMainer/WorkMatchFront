import styles from "./style.module.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export function LoginBack() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => event.preventDefault();
    const handleMouseUpPassword = (event) => event.preventDefault();

    const handleSubmit = async () => {
        const userData = {
            email,
            password,
            username,
            full_name: username,
            role: "user",
        };

        try {
            const response = await fetch("http://localhost:8000/v1/users/", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Успешная регистрация:", result);
                navigate("/main");
            } else {
                const error = await response.json();
                console.error("Ошибка регистрации:", error);
                alert("Ошибка регистрации: " + error.detail);
            }
        } catch (error) {
            console.error("Ошибка соединения:", error);
            alert("Сервер недоступен");
        }
    };

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
                        <span className={styles.reg}>Зарегистрироваться</span>
                        <span className={styles.regSub}>Найти работу</span>
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
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
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
                                            borderRadius: "10px",
                                            fontSize: "18px",
                                        },
                                    }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <TextField
                                        label="Email"
                                        variant="outlined"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
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
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
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
                            <div className={styles.loginButton}>
                                <Stack>
                                    <Button
                                        variant="contained"
                                        onClick={handleSubmit}
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
                                    to="/sign"
                                    style={{
                                        textDecoration: "none",
                                        color: "black",
                                    }}
                                >
                                    Уже есть аккаунт?
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
