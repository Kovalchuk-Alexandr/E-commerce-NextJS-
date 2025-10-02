import { Dispatch, SetStateAction } from "react";
import styles from "./styles.module.css";
import { log } from "console";

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

const SidebarCategories = ({filter, setFilter}: SidebarCategoriesProps) => {
	// Список категорий
	const categoriesItems = [
		{ name: "Футболки", href: "#!" },
		{ name: "Худи", href: "#!" },
		{ name: "Кофты", href: "#!" },
	];

	const setFilterCategory = (isChecked: boolean, value: string) => {

		console.log("isChecked: %s, value: %s", isChecked, value);
		console.log("filter: ", filter);


		const newCategories = (isChecked: boolean, value: string) => {
			if (isChecked) {
				return [...filter.category, value];
			}
			return filter.category.filter((category) => category != value);
		}

		setFilter({
			...filter,
			category: newCategories(isChecked, value)
		});
	}

	return (
		<div className={styles["sidebar-categories"]}>
			<h3 className="sidebar__title">Categories</h3>

			<ul className={styles["sidebar-categories__list"]}>
				{categoriesItems.map((item) => (
					<li
						key={item.name}
						className={styles["sidebar-categories__item"]}
					>
						<label className={styles["sidebar-categories__label"]}>
							<input
								type="checkbox"
								className={`${styles["sidebar-categories__input"]} ${styles["bounce-animation"]}`}
								name="category"
								value={item.name}
								onChange={(e) => setFilterCategory(e.target.checked, e.target.value)}
							/>
							<span
								className={styles["sidebar-categories__span"]}
							>
								{item.name}
							</span>
						</label>
					</li>
				))}
				{/* <li className={styles["sidebar-categories__item"]}>
					<label className={styles["sidebar-categories__label"]}>
						<input
							type="checkbox"
							className={styles["sidebar-categories__input"]}
						/>
						<span className={styles["sidebar-categories__span"]}>
							Футболки
						</span>
					</label>
				</li>
				<li className={styles["sidebar-categories__item"]}>
					<label className={styles["sidebar-categories__label"]}>
						<input
							type="checkbox"
							className={styles["sidebar-categories__input"]}
						/>
						<span className={styles["sidebar-categories__span"]}>
							Худи
						</span>
					</label>
				</li>
				<li className={styles["sidebar-categories__item"]}>
					<label className={styles["sidebar-categories__label"]}>
						<input
							type="checkbox"
							className={styles["sidebar-categories__input"]}
						/>
						<span className={styles["sidebar-categories__span"]}>
							Кофты
						</span>
					</label>
				</li> */}
			</ul>
		</div>
	);
}

export default SidebarCategories;
