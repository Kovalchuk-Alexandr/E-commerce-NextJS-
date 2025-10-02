import { Dispatch, SetStateAction } from "react";
import styles from "./styles.module.css";

interface FilterState {
	category: string[];
	color: string[];
	size: string[];
	price: [number | null, number | null];
}

interface PriceFilterProps {
	filter: FilterState;
	setFilter: Dispatch<SetStateAction<FilterState>>;
	title?: string;
	minPlaceholder?: string;
	maxPlaceholder?: string;
	currency?: string;
}

const PriceFilter = ({
	filter,
	setFilter,
	title = "Price",
	minPlaceholder = "Min",
	maxPlaceholder = "Max",
	currency = "$",
}: PriceFilterProps) => {
	const handlePriceChange = (type: "min" | "max", value: string) => {
		// Разрешаем только числа
		if (value !== "" && !/^\d+$/.test(value)) {
			return;
		}

		const numValue = value === "" ? null : Number(value);
		const newPrice: [number | null, number | null] = [...filter.price];

		if (type === "min") {
			newPrice[0] = numValue;
		} else {
			newPrice[1] = numValue;
		}

		setFilter({
			...filter,
			price: newPrice,
		});
	};

	// Валидация: min не должен быть больше max
	const validatePrice = () => {
		const [min, max] = filter.price;
		if (min !== null && max !== null && min > max) {
			return {
				isValid: false,
				message: "Min price cannot be greater than max price",
			};
		}
		return { isValid: true, message: "" };
	};

	const validation = validatePrice();

	// Очистка обоих полей
	const clearPriceFilter = () => {
		setFilter({
			...filter,
			price: [null, null],
		});
	};

	// Проверка, активен ли фильтр
	const isActive = filter.price[0] !== null || filter.price[1] !== null;

	return (
		<div className={styles["sidebar-price"]}>
			<div className={styles["sidebar-price__header"]}>
				<h3 className="sidebar__title">{title}</h3>
				{isActive && (
					<button
						onClick={clearPriceFilter}
						className={styles["sidebar-price__clear"]}
						aria-label="Clear price filter"
					>
						Clear
					</button>
				)}
			</div>

			<div className={styles["sidebar-price__range"]}>
				<div className={styles["sidebar-price__input-wrapper"]}>
					<span className={styles["sidebar-price__currency"]}>
						{currency}
					</span>
					<input
						type="text"
						inputMode="numeric"
						placeholder={minPlaceholder}
						className={`${styles["sidebar-price__input"]} ${
							!validation.isValid ? styles["error"] : ""
						}`}
						value={filter.price[0] || ""}
						onChange={(e) =>
							handlePriceChange("min", e.target.value)
						}
						aria-label="Minimum price"
					/>
				</div>

				<span className={styles["sidebar-price__separator"]}>—</span>

				<div className={styles["sidebar-price__input-wrapper"]}>
					<span className={styles["sidebar-price__currency"]}>
						{currency}
					</span>
					<input
						type="text"
						inputMode="numeric"
						placeholder={maxPlaceholder}
						className={`${styles["sidebar-price__input"]} ${
							!validation.isValid ? styles["error"] : ""
						}`}
						value={filter.price[1] || ""}
						onChange={(e) =>
							handlePriceChange("max", e.target.value)
						}
						aria-label="Maximum price"
					/>
				</div>
			</div>

			{!validation.isValid && (
				<p className={styles["sidebar-price__error"]}>
					{validation.message}
				</p>
			)}

			{isActive && (
				<div className={styles["sidebar-price__summary"]}>
					<span className={styles["sidebar-price__summary-text"]}>
						{filter.price[0] || 0} {currency} -{" "}
						{filter.price[1] || "∞"} {currency}
					</span>
				</div>
			)}
		</div>
	);
};

export default PriceFilter;
