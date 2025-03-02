import styles from "./style.module.css";

export function LoginBack() {
    return (
        <>
            <div className={styles.loginBackground}>
                <div className={styles.loginContainer}>
                    <div className={styles.logoContainer}>
                        <img src="/Logo.svg" alt="Логотип" />
                    </div>
                </div>
                <div className={styles.bodyHead}>
                    <div className={styles.mainLogin}>
                        <span className={styles.reg}>Зарегистрироваться</span>
                        <span className={styles.regSub}>Начать бесплатно</span>
                    </div>
                </div>
                <div className={styles.bodyLeg}></div>
            </div>
        </>
    );
}
