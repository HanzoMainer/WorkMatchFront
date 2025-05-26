import { useEffect, useState } from "react";
import { Box, Modal, Typography, Button } from "@mui/material";
import styles from "./../hr-main-page/page/style.module.css";

const SummaryModal = ({ open, onClose, summary }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (open && summary) {
            setIsVisible(false); 
            const timer = setTimeout(() => {
                setIsVisible(true); 
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [open, summary]);

    const sentences = summary
        ? summary
              .split(". ")
              .map((sentence, index, arr) =>
                  index < arr.length - 1 ? `${sentence}.` : sentence
              )
        : [];

    return (
        <Modal open={open} onClose={onClose}>
            <Box className={styles.modalBox} sx={{ maxWidth: 600 }}>
                <Typography variant="h6" sx={{ color: "#283618", mb: 2 }}>
                    Кратко о вакансии
                </Typography>   
                <Box>
                    {sentences.map((sentence, index) => (
                        <Typography
                            key={index}
                            sx={{
                                color: "#606c38",
                                whiteSpace: "pre-wrap",
                                fontFamily: "'Roboto', sans-serif",
                                opacity: isVisible ? 1 : 0,
                                filter: isVisible ? "blur(0)" : "blur(4px)",
                                transform: isVisible
                                    ? "translateY(0)"
                                    : "translateY(10px)",
                                transition: `opacity 0.8s ease ${
                                    index * 0.2
                                }s, filter 0.8s ease ${
                                    index * 0.2
                                }s, transform 0.8s ease ${index * 0.2}s`,
                            }}
                        >
                            {sentence}
                        </Typography>
                    ))}
                </Box>
                <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                    <Button
                        onClick={onClose}
                        variant="contained"
                        sx={{
                            backgroundColor: "#283618",
                            color: "#fefae0",
                            "&:hover": { backgroundColor: "#606c38" },
                        }}
                    >
                        Закрыть
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default SummaryModal;
