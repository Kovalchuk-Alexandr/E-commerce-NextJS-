export async function fetchProductsServer() {
	// Получаем базовый URl: "http://localhost:3050/products"
	const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
	const url = `${apiBaseUrl}/products`;

	try {
		console.log("Fetching from:", url);
		const response = await fetch(url);
		const productsData = await response.json();
		// setProducts(productsData);
		console.log("Products loaded:", productsData);
		return productsData;
	} catch (error) {
		console.error("Error fetching products:", error);
	}

}
