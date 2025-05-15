import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import styles from "./../hr-main-page/page/style.module.css";

const PasswordModalForm = ({
    passwordData,
    setPasswordData,
    onSubmit,
    error,
    success,
    onCancel,
}) => {
    return (
        <Box className={styles.modalBox}>
            <Typography variant="h6" gutterBottom>
                Смена пароля
            </Typography>
            <form onSubmit={onSubmit}>
                <TextField
                    label="Старый пароль"
                    type="password"
                    value={passwordData.old_password}
                    onChange={(e) =>
                        setPasswordData({
                            ...passwordData,
                            old_password: e.target.value,
                        })
                    }
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Новый пароль"
                    type="password"
                    value={passwordData.new_password}
                    onChange={(e) =>
                        setPasswordData({
                            ...passwordData,
                            new_password: e.target.value,
                        })
                    }
                    fullWidth
                    margin="normal"
                />
                <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        style={{ backgroundColor: "#283618" }}
                    >
                        Сменить пароль
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={onCancel}
                        style={{ color: "#283618", borderColor: "#283618" }}
                    >
                        Отмена
                    </Button>
                </Box>
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        {success}
                    </Alert>
                )}
            </form>
        </Box>
    );
};

export default PasswordModalForm;
