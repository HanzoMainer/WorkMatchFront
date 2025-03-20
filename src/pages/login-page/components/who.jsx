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

export function LoginWho() {
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
                        <span className={styles.reg}>Зарегистрироваться</span>
                        <span className={styles.regSub}>Начать бесплатно</span>
                    </div>
                </div>
                <div className={styles.bodyLeg}>
                    <div className={styles.subLogin}>
                        <div className={styles.buttonContainer}>Я</div>
                    </div>
                </div>
            </div>
        </>
    );
}
