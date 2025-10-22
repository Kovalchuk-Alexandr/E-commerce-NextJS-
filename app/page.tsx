import styles from "@/app/page.module.css";

import Header from "@/components/header/header";
import ProductsPageUpdated from "@/components/products/ProductsPageUpdated";
// import ProductsPage from "@/components/products/ProductsPage";
import {
	fetchProductsClient,
	fetchProductsServer,
	parsFiltersFromSearchParamsObject,
} from "@/lib/products";
import { Product, ProductFilters } from "@/types/product";

// import products from "@/data/products" // заменили на json-сервер;

export async function generateStaticParams() {}

export default async function Home({
	searchParams,
}: {
	searchParams?: { [key: string]: string | string[] | undefined };
}) {
	// console.log("=== PRODUCTS ===");
	// console.log(products);
	const params = await searchParams;
	// console.log("Serch Params: ", params);
	// console.log("Serch Params color: ", params?.["color"]);
	const filters = parsFiltersFromSearchParamsObject(params);

	const products = await fetchProductsServer(filters);

	return (
		<div className={`${styles["main-page"]} container`}>
			<Header />

			<ProductsPageUpdated
				initialProducts={products}
				initialFilters={filters}
			/>
			{/* <ProductsPage products={products} /> */}

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
