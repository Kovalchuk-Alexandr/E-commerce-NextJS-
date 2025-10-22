import { Dispatch, SetStateAction, useState, useRef } from "react";
import styles from "./styles.module.css";

interface FilterState {
	category: string[];
	color: string[];
	size: string[];
	price: [number | null, number | null];
}

interface FilterOption {
	name: string;
	value: string;
	colorCode?: string; // для цветов
	href?: string; // для категорий (если нужно)
}

interface FilterSectionProps {
	title: string;
	filterKey: keyof Omit<FilterState, "price">;
	options: FilterOption[];
	filter: FilterState;
	setFilter: Dispatch<SetStateAction<FilterState>>;
	type?: "checkbox" | "color"; // тип отображения
}

const FilterSection = ({
	title,
	filterKey,
	options,
	filter,
	setFilter,
	type = "checkbox",
}: FilterSectionProps) => {
	// Храним значения, которые только что были изменены
	const [justChanged, setJustChanged] = useState<Set<string>>(new Set());
	const timeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

	const setFilterValue = (isChecked: boolean, value: string) => {
		const currentValues = filter[filterKey] as string[];
		const newValues = isChecked
			? [...currentValues, value]
			: currentValues.filter((item) => item !== value);

		setFilter({
			...filter,
			[filterKey]: newValues,
		});

		// Добавляем значение в список "только что изменённых"
		setJustChanged((prev) => new Set(prev).add(value));

		// Очищаем предыдущий таймаут для этого значения
		if (timeoutRef.current[value]) {
			clearTimeout(timeoutRef.current[value]);
		}

		// Убираем из списка через время (длительность анимации)
		timeoutRef.current[value] = setTimeout(() => {
			setJustChanged((prev) => {
				const newSet = new Set(prev);
				newSet.delete(value);
				return newSet;
			});
		}, 600); // Длительность анимации bounce
	};

	const FilterItem = ({ option }: { option: FilterOption }) => {
		const isChecked = (filter[filterKey] as string[]).includes(
			option.value
		);
		const shouldAnimate = justChanged.has(option.value) && isChecked;

		if (type === "color") {
			return (
				<li className={styles["sidebar-colors__item"]}>
					<label className={styles["sidebar-colors__label"]}>
						<input
							type="checkbox"
							className={styles["sidebar-colors__input"]}
							name={filterKey}
							value={option.value}
							checked={isChecked}
							onChange={(e) =>
								setFilterValue(e.target.checked, e.target.value)
							}
						/>
						<span
							className={`${styles["sidebar-colors__color"]} ${
								isChecked ? styles["selected"] : ""
							}`}
							style={
								option.value === "white"
									? {
											backgroundColor: option.colorCode,
											border: "1px solid #b6b7bc",
									  }
									: { backgroundColor: option.colorCode }
							}
							title={option.name}
						></span>
					</label>
				</li>
			);
		}

		// Обычный checkbox для категорий и размеров
		return (
			<li className={styles[`sidebar-${filterKey}__item`]}>
				<label className={styles[`sidebar-${filterKey}__label`]}>
					<input
						type="checkbox"
						className={`${styles[`sidebar-${filterKey}__input`]}
							${shouldAnimate ? styles["bounce-animation"] : ""}`}
						name={filterKey}
						value={option.value}
						checked={isChecked}
						onChange={(e) =>
							setFilterValue(e.target.checked, e.target.value)
						}
					/>
					<span className={styles[`sidebar-${filterKey}__span`]}>
						{option.name}
					</span>
				</label>
			</li>
		);
	};

	return (
		<div className={styles[`sidebar-${filterKey}`]}>
			<h3 className={styles["sidebar__title"]}>{title}</h3>
			<ul className={styles[`sidebar-${filterKey}__list`]}>
				{options.map((option) => (
					<FilterItem key={option.value} option={option} />
				))}
			</ul>
		</div>
	);
};

export default FilterSection;
