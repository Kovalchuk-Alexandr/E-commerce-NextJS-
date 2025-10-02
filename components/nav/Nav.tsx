import styles from "./nav.module.css";

const Nav = () => {
	return (
		<ul className={styles["nav__list"]}>
			<li className={styles["nav__item"]}>
				<a
					href="#!"
					className={`${styles["nav__link"]} ${styles["nav__link--home"]}`}
				>
					Home
				</a>
			</li>
			<li className={styles["nav__item"]}>
				<a
					href="#!"
					className={`${styles["nav__link"]} ${styles["nav__link--categories"]}`}
				>
					Categories
					<svg
						className={styles["nav__link-arrow"]}
						width="24"
						height="25"
						viewBox="0 0 24 25"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M12.5327 15.3117C12.2557 15.561 11.8042 15.563 11.5243 15.3163L6 10.4486L7.00331 9.54604L12.0207 13.9672L16.9863 9.5L18 10.3932L12.5327 15.3117Z"
							// fill="#5C5F6A"
						/>
					</svg>
				</a>
			</li>
			<li className={styles["nav__item"]}>
				<a
					href="#!"
					className={`${styles["nav__link"]} ${styles["nav__link--about"]}`}
				>
					About
				</a>
			</li>
			<li className={styles["nav__item"]}>
				<a
					href="#!"
					className={`${styles["nav__link"]} ${styles["nav__link--contact"]}`}
				>
					Contact
				</a>
			</li>
		</ul>
	);
}

export default Nav;
