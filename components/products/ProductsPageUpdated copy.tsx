"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import styles from "./styles.module.css";
import Card from "@/components/card/Card";
import SidebarFilters from "@/components/sidebarCategories/SidebarFiltersUpdated";

import { buildProductSearchParams } from "@/lib/products";

const ProductsPage = ({ products }: { products: any[] }) => {
	const [filter, setFilter] = useState({
		category: [] as string[],
		color: [] as string[],
		size: [] as string[],
		price: [null, null] as [number | null, number | null],
	});

	// Получаем базовый URl
	const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
	const baseUrl = `${apiBaseUrl}/products`;

	const [product, setProducts] = useState([]);
	const [url, setUrl] = useState(baseUrl);

	const router = useRouter();
	const pathname = usePathname();

	// console.log("Router: ", router);
	// console.log("Pathname: ", pathname);

	// Функция для построения URL на основе фильтров
	const buildUrl = (filters: typeof filter) => {
		const params = new URLSearchParams();

		// Добавляем фильтры категорий
		if (filters.category.length > 0) {
			// filters.category.forEach((cat) =>
			// 	params.append("category_like", cat)
			// );
			let sep = "|";
			params.append("category_like", filters.category.join(sep));
		}

		// Добавляем фильтры цветов
		if (filters.color.length > 0) {
			filters.color.forEach((color) =>
				params.append("color_like", color)
			);
		}

		// Добавляем фильтры размеров
		if (filters.size.length > 0) {
			filters.size.forEach((size) => params.append("size_like", size));
		}

		// Добавляем фильтры цены
		if (filters.price[0] !== null) {
			params.append("price_gte", filters.price[0].toString());
		}
		if (filters.price[1] !== null) {
			params.append("price_lte", filters.price[1].toString());
		}

		const queryString = params.toString();
		console.log("Querystring: ", queryString);

		// return queryString ? `${baseUrl}?${queryString}` : baseUrl;
		return queryString ? `${pathname}?${queryString}` : pathname;
	};

	// Разбор параметров из URL для отладки
	const parseUrlParams = (url: string) => {
		const urlObj = new URL(url);
		const params = Object.fromEntries(urlObj.searchParams.entries());
		console.log("Parsed params:", params);

		// Для параметров с одинаковыми именами
		const allParams: { [key: string]: string[] } = {};
		urlObj.searchParams.forEach((value, key) => {
			if (!allParams[key]) allParams[key] = [];
			allParams[key].push(value);
		});
		console.log("All params (including duplicates):", allParams);
	};

	// Обновляем URL при изменении фильтров
	useEffect(() => {
		console.log("=== FILTER CHANGE DEBUG ===");
		console.log("Current filter state:", filter);

		// const newUrl = buildUrl(filter);
		const newUrl = buildProductSearchParams(filter);
		setUrl(newUrl);

		// router.replace(`${pathname}?${newUrl}`);
		router.replace(`${newUrl}`);

		console.log("Generated URL:", newUrl);
		// parseUrlParams(newUrl);
		console.log("=== END DEBUG ===");
	}, [filter]);

	// Запрос продуктов при изменении URL
	// useEffect(() => {
	// 	const getProducts = async () => {
	// 		try {
	// 			console.log("Fetching from:", url);
	// 			const response = await fetch(url);
	// 			const productsData = await response.json();
	// 			setProducts(productsData);
	// 			console.log("Products loaded:", productsData);
	// 		} catch (error) {
	// 			console.error("Error fetching products:", error);
	// 		}
	// 	};

	// 	getProducts();
	// }, [url]);

	// Функция для очистки всех фильтров
	const clearAllFilters = () => {
		setFilter({
			category: [],
			color: [],
			size: [],
			price: [null, null],
		});
	};

	// Функция для удаления конкретного фильтра
	const removeFilter = (filterType: keyof typeof filter, value: string) => {
		if (filterType === "price") return; // Цена обрабатывается отдельно

		const currentValues = filter[filterType] as string[];
		const newValues = currentValues.filter((item) => item !== value);

		setFilter({
			...filter,
			[filterType]: newValues,
		});
	};

	// Подсчет активных фильтров
	const getActiveFiltersCount = () => {
		const categoryCount = filter.category.length;
		const colorCount = filter.color.length;
		const sizeCount = filter.size.length;
		const priceCount =
			filter.price[0] !== null || filter.price[1] !== null ? 1 : 0;

		return categoryCount + colorCount + sizeCount + priceCount;
	};

	return (
		<main className={styles["main"]}>
			<div className={styles["main__sideBar"]}>
				<SidebarFilters filter={filter} setFilter={setFilter} />

				{/* Информация о примененных фильтрах */}
				{getActiveFiltersCount() > 0 && (
					<div className={styles["applied-filters"]}>
						<div className={styles["applied-filters__header"]}>
							<span>
								Applied Filters: {getActiveFiltersCount()}
							</span>
							<button
								onClick={clearAllFilters}
								className={styles["clear-all-btn"]}
							>
								Clear All
							</button>
						</div>

						<div className={styles["applied-filters__tags"]}>
							{/* Категории */}
							{filter.category.map((category) => (
								<span
									key={`category-${category}`}
									className={styles["filter-tag"]}
								>
									{category}
									<button
										onClick={() =>
											removeFilter("category", category)
										}
										className={styles["remove-filter-btn"]}
									>
										×
									</button>
								</span>
							))}

							{/* Цвета */}
							{filter.color.map((color) => (
								<span
									key={`color-${color}`}
									className={styles["filter-tag"]}
								>
									{color}
									<button
										onClick={() =>
											removeFilter("color", color)
										}
										className={styles["remove-filter-btn"]}
									>
										×
									</button>
								</span>
							))}

							{/* Размеры */}
							{filter.size.map((size) => (
								<span
									key={`size-${size}`}
									className={styles["filter-tag"]}
								>
									Size: {size}
									<button
										onClick={() =>
											removeFilter("size", size)
										}
										className={styles["remove-filter-btn"]}
									>
										×
									</button>
								</span>
							))}

							{/* Цена */}
							{(filter.price[0] !== null ||
								filter.price[1] !== null) && (
								<span className={styles["filter-tag"]}>
									Price: ${filter.price[0] || 0} - $
									{filter.price[1] || "∞"}
									<button
										onClick={() =>
											setFilter({
												...filter,
												price: [null, null],
											})
										}
										className={styles["remove-filter-btn"]}
									>
										×
									</button>
								</span>
							)}
						</div>
					</div>
				)}
			</div>

			<div className={styles["main__content"]}>
				<div className={styles["main__content-header"]}>
					<h2>Products ({products.length})</h2>
				</div>

				<div className={styles["main__content-grid"]}>
					{products.length > 0 ? (
						products.map((product: any) => (
							<Card key={product.id} {...product} />
						))
					) : (
						<div className={styles["no-products"]}>
							<p>No products found matching your filters.</p>
							<button onClick={clearAllFilters}>
								Clear all filters
							</button>
						</div>
					)}
				</div>
			</div>
		</main>
	);
};

export default ProductsPage;
