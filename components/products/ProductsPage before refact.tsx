"use client"; //чтобы использовать "useState" в Nextjs
import { useEffect, useState } from "react";

import styles from "./styles.module.css";
import Card from "@/components/card/Card";
import SidebarCategories from "@/components/sidebarCategories/SidebarCategories";

const ProductsPage = () => {
	const [filter, setFilter] = useState({
		category: [] as string[],
		color: [] as string[],
		size: [] as string[],
		price: [null, null] as [number | null, number | null],
	});

	// Получаем базовый URl: "http://localhost:3050/products"
	const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
	const baseUrl = `${apiBaseUrl}/products`;

	const [products, setProducts] = useState([]);
	const [url, setUrl] = useState(baseUrl);
	// const [url, setUrl] = useState("http://localhost:3050/products");

	// Функция для построения URL на основе фильтров
	const buildUrl = (filters: typeof filter) => {
		// const baseUrl = "http://localhost:3050/products";
		// const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
		// const baseUrl = `${apiBaseUrl}/products`;
		const params = new URLSearchParams();

		console.log("Url: ", url);

		// Добавляем категории (несколько запросов для json-server)
		if (filters.category.length > 0) {
			// Вариант 1: Повторяющиеся параметры
			filters.category.forEach((cat) =>
				params.append("category_like", cat)
			);

			// Вариант 2: Если нужно через запятую (но json-server это не поддерживает)
			// params.set('category', filters.category.join(','));
		}

		const queryString = params.toString();

		// console.log("queryString: ", queryString);
		return queryString ? `${baseUrl}?${queryString}` : baseUrl;
	};

	// 2. Разбор параметров из URL
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

		const newUrl = buildUrl(filter);
		setUrl(newUrl);

		console.log("Generated URL:", newUrl);
		parseUrlParams(newUrl);
		console.log("=== END DEBUG ===");

		/* Argument of type 'void' is not assignable to parameter of type 'SetStateAction<string>'.ts(2345)*/
	}, [filter]);

	// Запрос продуктов при изменении URL
	useEffect(() => {
		const getProducts = async () => {
			try {
				console.log("Fetching from:", url);
				const response = await fetch(url);
				const productsData = await response.json();
				setProducts(productsData);
				console.log("Products loaded:", productsData);
			} catch (error) {
				console.error("Error fetching products:", error);
			}
		};

		getProducts();
	}, [url]);

	return (
		<main className={styles["main"]}>
			<div className={styles["main__sideBar"]}>
				<SidebarCategories filter={filter} setFilter={setFilter} />
			</div>

			<div className={styles["main__content"]}>
				<div className={styles["main__content-grid"]}>
					{products.map((product: any) => (
						<Card key={product.id} {...product} />
					))}
				</div>
			</div>
		</main>
	);
}

export default ProductsPage;
