import {
    Box,
    Modal,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    Alert,
} from "@mui/material";

function AnalysisModal({ open, onClose, analysisData, error }) {
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    minWidth: 400,
                    maxWidth: 600,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Аналитика отклика
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                {analysisData ? (
                    <>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Процент соответствия:</strong>{" "}
                            {analysisData.match_percentage.toFixed(2)}%
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Несоответствия:</strong>
                        </Typography>
                        <List>
                            {analysisData.mismatches.map((mismatch, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={mismatch} />
                                </ListItem>
                            ))}
                        </List>
                    </>
                ) : (
                    <Typography variant="body1">Данные отсутствуют</Typography>
                )}
                <Button
                    variant="contained"
                    onClick={onClose}
                    sx={{ mt: 2, backgroundColor: "#283618", color: "#FEFAE0" }}
                >
                    Закрыть
                </Button>
            </Box>
        </Modal>
    );
}

export default AnalysisModal;
