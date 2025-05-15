import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import styles from "./../hr-main-page/page/style.module.css";

const ProfileModalForm = ({
    user,
    editData,
    setEditData,
    onSubmit,
    error,
    success,
    onCancel,
}) => {
    return (
        <Box className={styles.modalBox}>
            <Typography variant="h6" gutterBottom>
                Редактировать профиль
            </Typography>
            <form onSubmit={onSubmit}>
                <TextField
                    label="Полное имя"
                    value={editData.full_name}
                    onChange={(e) =>
                        setEditData({ ...editData, full_name: e.target.value })
                    }
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Email"
                    value={editData.email}
                    onChange={(e) =>
                        setEditData({ ...editData, email: e.target.value })
                    }
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Имя пользователя"
                    value={editData.username}
                    onChange={(e) =>
                        setEditData({ ...editData, username: e.target.value })
                    }
                    fullWidth
                    margin="normal"
                />
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                >
                    Роль: {user?.role || "Не указана"}
                </Typography>
                <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        style={{ backgroundColor: "#283618" }}
                    >
                        Сохранить
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

export default ProfileModalForm;
