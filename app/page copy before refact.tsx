"use client"; //чтобы использовать "useState" в Nextjs
import { useEffect, useState } from "react";

import styles from "./page.module.css";

import Header from "@/components/header/header";
import Card from "@/components/card/Card";
import SidebarCategories from "@/components/sidebarCategories/SidebarCategories";

// import products from "@/data/products" // заменили на json-сервер;

export default function Home() {
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

	/* http://localhost:3050/products/?category=%D0%A4%D1%83%D1%82%D0%B1%D0%BE%D0%BB%D0%BA%D0%B8
	/http://localhost:3050/products/?category_like=%D0%A4%D1%83%D1%82%D0%B1%D0%BE%D0%BB%D0%BA%D0%B8|%D0%A5%D1%83%D0%B4%D0%B8|%D0%9A%D0%BE%D1%84%D1%82%D1%8B&price_lte=30
	*/

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

	// useEffect(() => {
	// 	console.log(filter);

	// 	let url = "http://localhost:3050/products";

	// 	if (filter.category.length > 0) {
	// 		url += `?category=${filter.category.join(",")}`;
	// 	}

	// 	const getProducts = async (url: string) => {
	// 		const products = await fetch(url).then((res) => res.json());
	// 		setProducts(products);
	// 	};

	// 	console.log("URL: ", url);
	// 	getProducts(url);
	// 	console.log("_______  Products:________");
	// 	console.log(products);
	// }, [filter]);

	return (
		<div className={`${styles["main-page"]} container`}>
			<Header />

			<main className={styles["main"]}>
				{/* <h2>MAIN</h2> */}
				<div className={styles["main__sideBar"]}>
					<SidebarCategories filter={filter} setFilter={setFilter} />
				</div>

				<div className={styles["main__content"]}>
					<div className={styles["main__content-grid"]}>
						{products.map((product: any) => (
							<Card key={product.id} {...product} />
						))}

						{/* <Card
							title="Classic Monochrome Tees"
							image="/products/01.png"
							price={35}
							status="in stock"
						/> */}
					</div>
				</div>
			</main>
			<footer className={styles["footer"]}>
				FOOTER
				{/* <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a> */}
			</footer>
		</div>
	);
}
