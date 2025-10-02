import React from "react";
import styles from "./styles.module.css";
import Image from "next/image";


/* $35
* Format the price to USD
* @param price - The price to format
* @return The formatted price
*/
const formatPrice = (price: number) => {return `$${price.toFixed(2)}`}

interface CardProps {
    title: string;
    image: string;
    price: number;
    status: "in stock" | "out of stock";
	category: string;
	color: string;
}


const Card: React.FC<CardProps> = ({title, image, price, status, category, color}) => {
	return (
		<div className={styles["card"]}>
			<div className={styles["card__image"]}>
				<Image src={image} alt={title} width={"237"} height={"312"}/>
			</div>
			<div className={styles["card__desk"]}>
				<div className={styles["card__header"]}>
					<h4 className={styles["card__title"]}>{title}</h4>
					<p className={styles["card__color"]}>
						<span className={styles["card__color-title"]}>Color: </span>
						{color}
					</p>
				</div>
				<div className={styles["card__footer"]}>
					<p className={styles["card__status"]}>{status}</p>
					<p className={styles["card__price"]}>{formatPrice(price)}</p>
				</div>
			</div>
		</div>
	);
}

export default Card;
