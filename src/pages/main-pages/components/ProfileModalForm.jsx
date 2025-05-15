import {
    TextField,
    Button,
    Box,
    Typography,
    Alert,
    Tabs,
    Tab,
} from "@mui/material";
import styles from "./../hr-main-page/page/style.module.css";
import { useState } from "react";
import { red } from "@mui/material/colors";
const ProfileModalForm = ({
    user,
    editData,
    setEditData,
    passwordData,
    setPasswordData,
    onSubmitProfile,
    onSubmitPassword,
    error,
    success,
    onCancel,
}) => {
    const [tabValue, setTabValue] = useState("profile");

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleSubmit = (e) => {
        if (tabValue === "profile") {
            onSubmitProfile(e);
        } else {
            onSubmitPassword(e);
        }
    };

    return (
        <Box className={styles.modalBox}>
            <Typography variant="h6" gutterBottom>
                Редактировать профиль
            </Typography>
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                    "&.Mui-selected": {
                        color: "red",
                        backgroundColor: "blue",
                    },

                    mb: 2,
                }}
            >
                <Tab label="Профиль" value="profile" />
                <Tab label="Пароль" value="password" />
            </Tabs>
            <form onSubmit={handleSubmit}>
                {tabValue === "profile" ? (
                    <>
                        <TextField
                            label="Полное имя"
                            value={editData.full_name}
                            onChange={(e) =>
                                setEditData({
                                    ...editData,
                                    full_name: e.target.value,
                                })
                            }
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Email"
                            value={editData.email}
                            onChange={(e) =>
                                setEditData({
                                    ...editData,
                                    email: e.target.value,
                                })
                            }
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Имя пользователя"
                            value={editData.username}
                            onChange={(e) =>
                                setEditData({
                                    ...editData,
                                    username: e.target.value,
                                })
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
                    </>
                ) : (
                    <>
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
                    </>
                )}
                <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        style={{ backgroundColor: "#283618" }}
                    >
                        {tabValue === "profile"
                            ? "Сохранить"
                            : "Сменить пароль"}
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
