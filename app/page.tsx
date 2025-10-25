import styles from "@/app/page.module.css";

import Header from "@/components/header/header";
import ProductsPageUpdated from "@/components/products/ProductsPageUpdated";
import {
	fetchProductsServer,
	parsFiltersFromSearchParamsObject,
} from "@/lib/products";

// Правильная типизация для Next.js 15+
type PageProps = {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: PageProps) {
	// Получаем параметры поиска
	const params = await searchParams;

	// Парсим фильтры из URL
	const filters = parsFiltersFromSearchParamsObject(params);

	// Загружаем продукты (для статического экспорта - все продукты)
	// Фильтрация будет происходить на клиенте в ProductsPageUpdated
	const products = await fetchProductsServer();

	return (
		<div className={`${styles["main-page"]} container`}>
			<Header />

			<ProductsPageUpdated
				initialProducts={products}
				initialFilters={filters}
			/>

			<footer className={styles["footer"]}>FOOTER</footer>
		</div>
	);
}
