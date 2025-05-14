import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import {
    Box,
    TextField,
    IconButton,
    InputAdornment,
    FormControl,
    InputLabel,
    OutlinedInput,
    Button,
    Stack,
    Modal,
    Typography,
    Alert,
    RadioGroup,
    FormControlLabel,
    Radio,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import styles from "./style.module.css";

export function SignUpBack() {
    const navigate = useNavigate();
    const { signin } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState("user");

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => event.preventDefault();
    const handleMouseUpPassword = (event) => event.preventDefault();

    const validateForm = () => {
        if (!email.includes("@")) return "Неверный формат email";
        if (password.length < 8)
            return "Пароль должен содержать минимум 8 символов";
        if (!username) return "Имя пользователя обязательно";
        return null;
    };

    const handleSubmit = async () => {
        setError(null);
        setSuccess(null);

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setOpenModal(true);
    };

    const handleRoleConfirm = async () => {
        setError(null);
        setSuccess(null);

        const userData = {
            email,
            password,
            username,
            full_name: username,
            role: selectedRole,
        };

        try {
            const registerResponse = await fetch(
                "http://localhost:8000/v1/users/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userData),
                }
            );

            if (!registerResponse.ok) {
                const errorData = await registerResponse.json();
                throw new Error(errorData.detail || "Ошибка регистрации");
            }

            const loginResponse = await fetch(
                "http://localhost:8000/v1/users/login/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                }
            );

            if (!loginResponse.ok) {
                throw new Error("Ошибка входа после регистрации");
            }

            const result = await loginResponse.json();
            signin(result.access_token, result.refresh_token);
            setSuccess("Регистрация и вход выполнены успешно!");
            setOpenModal(false);

            navigate(selectedRole === "user" ? "/usermain" : "/hrmain", {
                replace: true,
            });
        } catch (error) {
            console.error("Ошибка:", error.message);
            setError(error.message);
        }
    };

    return (
        <div className={styles.loginBackground}>
            <div className={styles.loginContainer}>
                <div className={styles.logoContainer}>
                    <img src="/Logo.svg" alt="Логотип" />
                </div>
            </div>
            <div className={styles.bodyHead}>
                <div className={styles.mainLogin}>
                    <Typography variant="h4" className={styles.reg}>
                        Зарегистрироваться
                    </Typography>
                    <Typography variant="subtitle1" className={styles.regSub}>
                        Найти работу
                    </Typography>
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
                                            fontFamily: '"Roboto", sans-serif',
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
                                    onChange={(e) => setEmail(e.target.value)}
                                    sx={{
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
                                            <InputAdornment position="end">
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
                                to="/signin"
                                style={{
                                    textDecoration: "none",
                                    color: "black",
                                }}
                            >
                                Уже есть аккаунт?
                            </Link>
                        </div>
                        {error && (
                            <Alert
                                severity="error"
                                sx={{
                                    mt: 2,
                                    width: {
                                        xs: "100%",
                                        sm: "80%",
                                        md: "60%",
                                        lg: "46%",
                                    },
                                    mx: "auto",
                                }}
                            >
                                {error}
                            </Alert>
                        )}
                        {success && (
                            <Alert
                                severity="success"
                                sx={{
                                    mt: 2,
                                    width: {
                                        xs: "100%",
                                        sm: "80%",
                                        md: "60%",
                                        lg: "46%",
                                    },
                                    mx: "auto",
                                }}
                            >
                                {success}
                            </Alert>
                        )}
                    </div>
                </div>
            </div>
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "white",
                        borderRadius: "8px",
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Выберите роль
                    </Typography>
                    <RadioGroup
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                    >
                        <FormControlLabel
                            value="user"
                            control={<Radio />}
                            label="Пользователь"
                            color="black"
                        />
                        <FormControlLabel
                            value="hr"
                            control={<Radio />}
                            label="HR"
                        />
                    </RadioGroup>
                    <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                        <Button
                            variant="contained"
                            onClick={handleRoleConfirm}
                            sx={{
                                backgroundColor: "#606C38",
                                "&:hover": { backgroundColor: "#4F5A2E" },
                            }}
                        >
                            Продолжить
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => setOpenModal(false)}
                            color="#4F5A2E"
                        >
                            Отмена
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
