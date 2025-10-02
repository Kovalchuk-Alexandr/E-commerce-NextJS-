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

const SidebarCategories = ({ filter, setFilter }: SidebarCategoriesProps) => {
	// Список категорий
	const CATEGORIES = [
		{ name: "Футболки", checked: false, href: "#!" },
		{ name: "Худи", checked: false, href: "#!" },
		{ name: "Кофты", checked: false, href: "#!" },
	];

	// const setFilterCategory = (isChecked: boolean, value: string) => {
	// 	console.log("isChecked: %s, value: %s", isChecked, value);
	// 	console.log("filter: ", filter);

	// 	const newCategories = (isChecked: boolean, value: string) => {
	// 		if (isChecked) {
	// 			return [...filter.category, value];
	// 		}
	// 		return filter.category.filter((category) => category != value);
	// 	};

	// 	setFilter({
	// 		...filter,
	// 		category: newCategories(isChecked, value),
	// 	});
	// };

	const CategoryItem = (
		{ name }: { name: string },
	) => {
		// console.log("=== ITEM ===");
		// console.log(name);

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
		<div className={styles["sidebar-categories"]}>
			<h3 className="sidebar__title">Categories</h3>

			<ul className={styles["sidebar-categories__list"]}>
				{CATEGORIES.map((item) => (
					<CategoryItem key={item.name} name={item.name} checked={item.checked}/>
				))}
			</ul>
		</div>
	);
};

export default SidebarCategories;
