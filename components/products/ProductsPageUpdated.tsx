"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import styles from "./styles.module.css";
import Card from "@/components/card/Card";
import SidebarFilters from "@/components/sidebarCategories/SidebarFiltersUpdated";

import { buildProductSearchParams, fetchProductsClient } from "@/lib/products";
import { Product, ProductFilters } from "@/types/product";

// Ф. предотвращает многократный рендеринг при частом изменении критерия (допустим range-slider)
function useDebounced<T>(value: T, delay: number = 300) {
	const [v, setV] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => setV(value), delay);
		return () => clearTimeout(handler);
	}, [value, delay]);

	return v;
}

// Функция для нормализации фильтров с дефолтными значениями
function normalizeFilters(filters: ProductFilters): Required<ProductFilters> {
	return {
		category: filters.category || [],
		color: filters.color || [],
		size: filters.size || [],
		price: filters.price || [null, null],
	};
}

const ProductsPage = ({
	initialProducts,
	initialFilters,
}: {
	initialProducts: Product[];
	initialFilters: ProductFilters;
}) => {
	/* Состояние фильтров с нормализацией */
	const [filter, setFilter] = useState<Required<ProductFilters>>(() => 
		normalizeFilters(initialFilters)
	);

	/* Состояние товаров */
	const [products, setProducts] = useState<Product[]>(initialProducts);

	const router = useRouter();
	const pathname = usePathname();

	const debounceFilter = useDebounced(filter, 300);

	// Обновление URL в браузере при изменении фильтров
	const buildUrl = useCallback(
		(filters: typeof filter) => {
			const params = buildProductSearchParams(filters);
			const queryString = params.toString();

			// Формируем полный путь
			const fullPath = queryString
				? `${pathname}?${queryString}`
				: pathname;

			// Обновляем URL в браузере
			router.replace(fullPath);

			return fullPath;
		},
		[pathname, router]
	);

	// Обновляем URL при изменении фильтров
	useEffect(() => {
		buildUrl(filter);
	}, [filter, buildUrl]);

	// Запрос продуктов с debounce
	useEffect(() => {
		fetchProductsClient(debounceFilter).then((productsData) => {
			setProducts(productsData);
		});
	}, [debounceFilter]);

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
		const categoryCount = filter.category?.length || 0;
		const colorCount = filter.color?.length || 0;
		const sizeCount = filter.size?.length || 0;
		const priceCount =
			filter.price?.[0] !== null || filter.price?.[1] !== null ? 1 : 0;

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
							{filter.category?.map((category) => (
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
							{filter.color?.map((color) => (
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
							{filter.size?.map((size) => (
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
							{(filter.price?.[0] !== null ||
								filter.price?.[1] !== null) && (
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
						products.map((product) => (
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