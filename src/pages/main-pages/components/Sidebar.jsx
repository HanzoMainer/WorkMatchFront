import { Box, Typography } from "@mui/material";
import styles from "./../hr-main-page/page/style.module.css";

const Sidebar = ({ items }) => {
    return (
        <Box
            sx={{
                width: 240,
                flexShrink: 0,
                mt: "10%",
                backgroundColor: "#fefae0",
                borderRight: "1px solid #ddd",
            }}
        >
            <Box className={styles.sidebarList}>
                {items.map((item, index) => (
                    <button
                        key={index}
                        className={styles.sidebarItem}
                        onClick={item.onClick}
                    >
                        {item.icon}
                        <Typography variant="body1">{item.label}</Typography>
                    </button>
                ))}
            </Box>
        </Box>
    );
};

export default Sidebar;
