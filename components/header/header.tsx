import styles from "./header.module.css";
import Logo from "@/components/logo/Logo";
import Nav from "@/components/nav/Nav";


const Header = () => {
	return (
        // <div className="container">
            <header className={styles["header"]}>
                <div className={`${styles["header__col"]} ${styles["header__col--left"]}`}>
                    <div className={styles["header__logo"]}><Logo /></div>
                    <div className={styles["header__nav"]}><Nav /></div>
                </div>

                <div className={`${styles["header__col"]} ${styles["header__col--right"]}`}>
                    <form className={styles["header__search"]}>
                    <input type="text" placeholder="Search" />
                    <button type="submit">Search</button>
                    </form>
                    <div className={styles["header__user-menu"]}>USER</div>
                </div>
            </header>
        // </div>
	  );
}

export default Header;
