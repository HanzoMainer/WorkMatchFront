import styles from "./style.module.css";
import { Link } from "react-router-dom";
import * as React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";

export function MainBack() {
    const jobs = [
        {
            id: 1,
            title: "Frontend Developer",
            company: "TechCorp",
            location: "Москва",
        },
        {
            id: 2,
            title: "Backend Developer",
            company: "SoftGroup",
            location: "Санкт-Петербург",
        },
        {
            id: 3,
            title: "UI/UX Designer",
            company: "DesignPro",
            location: "Новосибирск",
        },
    ];

    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState([]);

    useEffect(() => {
        if (inputValue.length > 0) {
            fetch(`http://localhost:8000/search?q=${inputValue}`)
                .then((res) => res.json())
                .then((data) => setOptions(data))
                .catch((err) => console.error("Error fetching data:", err));
        } else {
            setOptions([]);
        }
    }, [inputValue]);

    return (
        <div className={styles.loginBackground}>
            <div className={styles.logo}>
                <div className={styles.logoContainer}>
                    <Link to="/main">
                        <img
                            src="/Logo.svg"
                            alt="Логотип"
                            className={styles.logoPhoto}
                            onClick={() => (window.location.href = "/main")}
                        />
                    </Link>
                </div>
            </div>
            <div className={styles.bodyHead}>
                <div>
                    <Stack spacing={2} sx={{ width: 300 }}>
                        <Autocomplete
                            freeSolo
                            id="free-solo-2-demo"
                            disableClearable
                            options={top100Films.map((option) => option.title)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search input"
                                    slotProps={{
                                        input: {
                                            ...params.InputProps,
                                            type: "search",
                                        },
                                    }}
                                />
                            )}
                        />
                    </Stack>
                </div>
            </div>
            <div className={styles.bodyLeg}>
                <div className={styles.jobList}>
                    {jobs.map((job) => (
                        <div key={job.id} className={styles.jobCard}>
                            <h2>{job.title}</h2>
                            <p>
                                {job.company} - {job.location}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
