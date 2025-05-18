import styles from "./style.module.css";
import { useState, useEffect, useContext } from "react";
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
import Alert from "@mui/material/Alert";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

export function SignInBack() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { signin, isAuthenticated } = useContext(AuthContext);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => event.preventDefault();
    const handleMouseUpPassword = (event) => event.preventDefault();

    const handleLogin = async () => {
        const loginData = {
            email,
            password,
        };

        try {
            const response = await fetch(
                "http://localhost:8000/v1/users/login/",
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(loginData),
                }
            );

            if (response.ok) {
                const result = await response.json();
                console.log("Успешный вход:", result);
                signin(result.access_token, result.refresh_token);
                setSuccess("Вход успешен!");
                setError(null);

                const userInfoResponse = await fetch(
                    "http://localhost:8000/v1/users/me/",
                    {
                        headers: {
                            Authorization: `Bearer ${result.access_token}`,
                        },
                    }
                );

                if (userInfoResponse.ok) {
                    const userInfo = await userInfoResponse.json();
                    const userRole = userInfo.role || "user";

                    setTimeout(
                        () =>
                            navigate(
                                userRole === "user" ? "/usermain" : "/hrmain"
                            ),
                        0
                    );
                } else {
                    setTimeout(() => navigate("/usermain"), 0);
                }
            } else {
                const errorData = await response.json();
                console.error("Ошибка входа:", errorData);
                let errorMessage;
                if (Array.isArray(errorData.detail)) {
                    errorMessage = errorData.detail
                        .map((err) => err.msg || "Неизвестная ошибка")
                        .join(", ");
                } else if (typeof errorData.detail === "string") {
                    errorMessage = errorData.detail;
                } else {
                    errorMessage = "Неверные учетные данные";
                }
                setError("Ошибка входа: " + errorMessage);
                setSuccess(null);
            }
        } catch (error) {
            console.error("Ошибка соединения:", error);
            setError("Сервер недоступен");
            setSuccess(null);
        }
    };

    useEffect(() => {
        const checkUserRole = async () => {
            if (isAuthenticated) {
                try {
                    const token = localStorage.getItem("access_token");
                    if (!token) {
                        return;
                    }

                    const userInfoResponse = await fetch(
                        "http://localhost:8000/v1/users/me/",
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (userInfoResponse.ok) {
                        const userInfo = await userInfoResponse.json();
                        const userRole = userInfo.role || "user";
                        navigate(
                            userRole === "user" ? "/usermain" : "/hrmain",
                            { replace: true }
                        );
                    } else {
                        navigate("/usermain", { replace: true });
                    }
                } catch (error) {
                    console.error("Ошибка проверки роли:", error);
                    navigate("/usermain", { replace: true });
                }
            }
        };

        checkUserRole();
    }, [isAuthenticated, navigate]);

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
                            {error && (
                                <Alert
                                    severity="error"
                                    sx={{ width: "100%", mb: 2 }}
                                >
                                    {error}
                                </Alert>
                            )}
                            {success && (
                                <Alert
                                    severity="success"
                                    sx={{ width: "100%", mb: 2 }}
                                >
                                    {success}
                                </Alert>
                            )}
                            <div className={styles.button}>
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    sx={{
                                        m: 1,
                                        width: {
                                            xs: "100%",
                                            sm: "80%",
                                            md: "60%",
                                            lg: "46%",
                                        },
                                        backgroundColor: "white",
                                        "& .MuiOutlinedInput-root": {
                                            fontSize: "20px",
                                            borderRadius: "10px",
                                            padding: "3px",
                                        },
                                        "& .MuiInputLabel-root": {
                                            fontFamily: '"Roboto", sans-serif',
                                            fontSize: "20px",
                                        },
                                    }}
                                />
                            </div>
                            <div className={styles.button}>
                                <FormControl
                                    sx={{
                                        m: 1,
                                        width: {
                                            xs: "100%",
                                            sm: "80%",
                                            md: "60%",
                                            lg: "46%",
                                        },
                                        backgroundColor: "white",
                                        "& .MuiOutlinedInput-root": {
                                            fontSize: "20px",
                                            borderRadius: "10px",
                                            padding: "3px",
                                        },
                                        "& .MuiInputLabel-root": {
                                            fontFamily: '"Roboto", sans-serif',
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
                                            showPassword ? "text" : "password"
                                        }
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        endAdornment={
                                            <InputAdornment position="start">
                                                <IconButton
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
                            </div>
                            <div className={styles.checkboxContainer}>
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
                                        onClick={handleLogin}
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
                                    to="/signup"
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
