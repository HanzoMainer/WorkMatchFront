import styles from "./style.module.css";

export function MainBack() {
    return (
        <>
            <div className={styles.loginBackground}>
                <div className={styles.logo}>
                    <div className={styles.logoContainer}>
                        <img src="/Logo.svg" alt="Логотип" />
                    </div>
                </div>
                <div className={styles.bodyHead}>
                </div>
                <div className={styles.bodyLeg}>
                </div>
            </div>
        </>
    );
}
