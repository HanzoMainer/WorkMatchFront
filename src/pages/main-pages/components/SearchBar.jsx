import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ searchQuery, setSearchQuery, placeholder, onSearch }) => {
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (typeof onSearch === "function") {
                onSearch();
            }
        }
    };

    return (
        <TextField
            fullWidth
            variant="outlined"
            placeholder={placeholder || "Поиск..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#283618" }} />
                    </InputAdornment>
                ),
            }}
            sx={{
                "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                        borderColor: "#283618",
                    },
                    "&:hover fieldset": {
                        borderColor: "#606c38",
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "#283618",
                    },
                },
                "& .MuiInputBase-input": {
                    color: "#283618",
                },
                "& .MuiInputLabel-root": {
                    color: "#283618",
                },
            }}
        />
    );
};

export default SearchBar;
