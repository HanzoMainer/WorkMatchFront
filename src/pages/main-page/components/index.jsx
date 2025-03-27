import styles from "./style.module.css";
import { Link } from "react-router-dom";
import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

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

    return (
        <div className={styles.loginBackground}>
            <div className={styles.bodyHead}>
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
            <div className={styles.bodyLeg}>
                <div className={styles.jobList}>
                    <p className={styles.font1}>Вакансии сейчас</p>
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
