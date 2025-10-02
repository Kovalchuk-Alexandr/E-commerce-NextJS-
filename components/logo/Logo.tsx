import styles from "./logo.module.css";
import Image from "next/image";

const Logo = () => {
	return ( 
		<div className={styles["logo"]}>
			<div className={styles["logo__image"]}>
				<Image src="/logo.svg" alt="logo" width={40} height={41} />
			</div>
			<span className={styles["logo__text"]}>Ecommerce</span>
		</div>
	 );
}

export default Logo;
