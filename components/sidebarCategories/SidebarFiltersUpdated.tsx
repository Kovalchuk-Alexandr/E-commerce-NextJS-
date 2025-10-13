import { Dispatch, SetStateAction } from "react";
import styles from "./styles.module.css";
import FilterSection from "./FilterSection";
import PriceFilter from "@/components/priceFilter/PriceFilter";

interface FilterState {
	category: string[];
	color: string[];
	size: string[];
	price: [number | null, number | null];
}

interface SidebarFiltersProps {
	filter: FilterState;
	setFilter: Dispatch<SetStateAction<FilterState>>;
}

const SidebarFilters = ({ filter, setFilter }: SidebarFiltersProps) => {
	// Конфигурация для всех фильтров
	const FILTER_CONFIG = {
		categories: {
			title: "Categories",
			filterKey: "category" as const,
			type: "checkbox" as const,
			options: [
				{ name: "Футболки", value: "tshirts" },
				{ name: "Худи", value: "hoodies" },
				{ name: "Кофты", value: "sweatshirts" },
				{ name: "Рубашки", value: "shirts" },
				{ name: "Джинсы", value: "jeans" },
			]
		},
		colors: {
			title: "Color",
			filterKey: "color" as const,
			type: "color" as const,
			options: [
				{ name: "Blue", value: "blue", colorCode: "#306cef" },
				{ name: "Brown", value: "brown", colorCode: "#a52a2a" },
				{ name: "Black", value: "black", colorCode: "#0e1422" },
				{ name: "White", value: "white", colorCode: "#ffffff" },
				// { name: "Gray", value: "gray", colorCode: "#6b7280" },
				// { name: "Green", value: "green", colorCode: "#10b981" },
				// { name: "Red", value: "red", colorCode: "#ef4444" },
				// { name: "Yellow", value: "yellow", colorCode: "#f59e0b" },
			]
		},
		sizes: {
			title: "Size",
			filterKey: "size" as const,
			type: "checkbox" as const,
			options: [
				{ name: "XS", value: "xs" },
				{ name: "S", value: "s" },
				{ name: "M", value: "m" },
				{ name: "L", value: "l" },
				{ name: "XL", value: "xl" },
				{ name: "XXL", value: "xxl" },
			]
		}
	};

	// Компонент для фильтра цен
	// const PriceFilter = () => {
	// 	const handlePriceChange = (type: 'min' | 'max', value: string) => {
	// 		const numValue = value === '' ? null : Number(value);
	// 		const newPrice: [number | null, number | null] = [...filter.price];

	// 		if (type === 'min') {
	// 			newPrice[0] = numValue;
	// 		} else {
	// 			newPrice[1] = numValue;
	// 		}

	// 		setFilter({
	// 			...filter,
	// 			price: newPrice
	// 		});
	// 	};

	// 	return (
	// 		<div className={styles["sidebar-price"]}>
	// 			<h3 className={styles["sidebar__title"]}>Price</h3>
	// 			<div className={styles["sidebar-price__range"]}>
	// 				<input
	// 					type="number"
	// 					placeholder="Min"
	// 					className={styles["sidebar-price__input"]}
	// 					value={filter.price[0] || ''}
	// 					onChange={(e) => handlePriceChange('min', e.target.value)}
	// 				/>
	// 				<span className={styles["sidebar-price__separator"]}>-</span>
	// 				<input
	// 					type="number"
	// 					placeholder="Max"
	// 					className={styles["sidebar-price__input"]}
	// 					value={filter.price[1] || ''}
	// 					onChange={(e) => handlePriceChange('max', e.target.value)}
	// 				/>
	// 			</div>
	// 		</div>
	// 	);
	// };

	return (
		<div className={styles["sidebar-filters"]}>
			{/* Категории */}
			<FilterSection
				title={FILTER_CONFIG.categories.title}
				filterKey={FILTER_CONFIG.categories.filterKey}
				options={FILTER_CONFIG.categories.options}
				filter={filter}
				setFilter={setFilter}
				type={FILTER_CONFIG.categories.type}
			/>

			{/* Цвета */}
			<FilterSection
				title={FILTER_CONFIG.colors.title}
				filterKey={FILTER_CONFIG.colors.filterKey}
				options={FILTER_CONFIG.colors.options}
				filter={filter}
				setFilter={setFilter}
				type={FILTER_CONFIG.colors.type}
			/>

			{/* Размеры */}
			<FilterSection
				title={FILTER_CONFIG.sizes.title}
				filterKey={FILTER_CONFIG.sizes.filterKey}
				options={FILTER_CONFIG.sizes.options}
				filter={filter}
				setFilter={setFilter}
				type={FILTER_CONFIG.sizes.type}
			/>

			{/* Цена */}
			<PriceFilter
				filter={filter}
				setFilter={setFilter}
				title="Price"
				currency="$" // или "₴", "€", "£"
				minPrice={0} // минимальная цена
				maxPrice={100} // максимальная цена
				step={0.01} // шаг изменения
			/>
		</div>
	);
};

export default SidebarFilters;
