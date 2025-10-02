import { Dispatch, SetStateAction } from "react";
import styles from "./styles.module.css";

interface FilterState {
	category: string[];
	color: string[];
	size: string[];
	price: [number | null, number | null];
}

interface SidebarCategoriesProps {
	filter: FilterState;
	setFilter: Dispatch<SetStateAction<FilterState>>;
}

const SidebarFilters = ({ filter, setFilter }: SidebarCategoriesProps) => {
	// Список категорий
	const CATEGORIES = [
		{ name: "Футболки", href: "#!" },
		{ name: "Худи", href: "#!" },
		{ name: "Кофты", href: "#!" },
	];

	const COLORS = [
		// "blue",
		// "brown",
		// "black",
		// "white",
		{ colorName: "blue", colorCode: "#306cef" },
		{ colorName: "brown", colorCode: "#a52a2a" },
		{ colorName: "black", colorCode: "#0e1422" },
		{ colorName: "white", colorCode: "#fff" },
	];

	const SIZES = [
		"S",
		"M",
		"L",
		"XL",
		"XXL"
	];

	const setFilterCategory = (isChecked: boolean, value: string) => {
		console.log("isChecked: %s, value: %s", isChecked, value);
		console.log("filter: ", filter);

		const newCategories = isChecked
			? [...filter.category, value]
			: filter.category.filter((category) => category !== value);

		setFilter({
			...filter,
			category: newCategories,
		});
	};

	const CategoryItem = ({ name }: { name: string }) => {
		// Проверяем, выбрана ли эта категория в текущем фильтре
		const isChecked = filter.category.includes(name);

		return (
			<li className={styles["sidebar-categories__item"]}>
				<label className={styles["sidebar-categories__label"]}>
					<input
						type="checkbox"
						className={`${styles["sidebar-categories__input"]} ${styles["bounce-animation"]}`}
						name="category"
						value={name}
						checked={isChecked}
						onChange={(e) =>
							setFilterCategory(e.target.checked, e.target.value)
						}
					/>
					<span className={styles["sidebar-categories__span"]}>
						{name}
					</span>
				</label>
			</li>
		);
	};

	return (
		<>
			<div className={styles["sidebar-categories"]}>
				<h3 className="sidebar__title">Categories</h3>

				<ul className={styles["sidebar-categories__list"]}>
					{CATEGORIES.map((item) => (
						<CategoryItem key={item.name} name={item.name} />
					))}
				</ul>
			</div>

			<div className={styles["sidebar-colors"]}>
				<h3 className="sidebar__title">Color</h3>

				<ul className={styles["sidebar-colors__list"]}>
					{COLORS.map((item) => (
						<CategoryItem
							key={item.colorName}
							name={item.colorName}
							// code={item.colorCode}
						/>
					))}
				</ul>
			</div>
		</>
	);
};

export default SidebarFilters;
