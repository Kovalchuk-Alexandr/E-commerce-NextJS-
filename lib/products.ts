// import { URLSearchParams } from "url";
import { Product, ProductFilters } from "@/types/product";

export function parsFiltersFromSearchParamsObject(searchParams?: {
	[key: string]: string | string[] | undefined;
}): ProductFilters {
	const getArray = (value: string | string[] | undefined): string[] => {
		// Если получили одиночное значение
		if (typeof value === "string" || typeof value === "number") {
			const strValue = value.toString();
			// Если строка содержит разделитель |, разбиваем её
			if (strValue.includes("|")) {
				return strValue.split("|").filter((v) => v.trim() !== "");
			}
			return [strValue];
		}
		// Если получили массив, то его и возвращаем
		if (Array.isArray(value)) {
			// Обрабатываем каждый элемент массива на случай, если там есть разделители
			return value.flatMap((v) => {
				const strValue = v.toString();
				if (strValue.includes("|")) {
					return strValue
						.split("|")
						.filter((item) => item.trim() !== "");
				}
				return [strValue];
			});
		}
		// Если не строка, не число, и не массив, возвращаем пустой массив
		return [];
	};

	const priceMin =
		typeof searchParams?.["price_gte"] === "string"
			? Number(searchParams?.["price_gte"])
			: Array.isArray(searchParams?.["price_gte"])
			? Number(searchParams?.["price_gte"][0])
			: null;

	const priceMax =
		typeof searchParams?.["price_lte"] === "string"
			? Number(searchParams?.["price_lte"])
			: Array.isArray(searchParams?.["price_lte"])
			? Number(searchParams?.["price_lte"][0])
			: null;

	const filters: ProductFilters = {
		category: getArray(searchParams?.["category_like"]),
		color: getArray(searchParams?.["color_like"]),
		size: getArray(searchParams?.["size_like"]),
		price: [priceMin, priceMax],
	};

	// console.log("Parsed filters: ", filters);

	return filters;
}

export async function fetchProducts() {
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

export async function fetchProductsServer(
	filter: ProductFilters
): Promise<Product[]> {
	// Получаем базовый URl: "http://localhost:3050/products"
	const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
	let url = `${apiBaseUrl}/products`;

	// try {
	// 	console.log("Fetching from:", url);
	// 	const response = await fetch(url);
	// 	const productsData = await response.json();
	// 	// setProducts(productsData);
	// 	console.log("Products loaded:", productsData);
	// 	return productsData;
	// } catch (error) {
	// 	console.error("Error fetching products:", error);
	// }
	const params = buildProductSearchParams(filter).toString();

	// Добавляем параметры только если они есть
	if (params) {
		url += `?${params}`;
	}

	// console.log("Fetching from:", url);
	// console.log("Params: ", params);

	const response = await fetch(url);
	const productsData = await response.json();
	// console.log("Products loaded:", productsData);
	return productsData;
}

export async function fetchProductsClient(
	filter: ProductFilters
): Promise<Product[]> {
	// Получаем базовый URl: "http://localhost:3050/products"
	const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
	let url = `${apiBaseUrl}/products`;

	const params = buildProductSearchParams(filter).toString();

	// Добавляем параметры только если они есть
	if (params) {
		url += `?${params}`;
	}

	const response = await fetch(url);
	const productsData = await response.json();
	// console.log("Products Client loaded:", productsData);
	return productsData;
}

// Функция для построения URL на основе фильтров
export function buildProductSearchParams(
	filters: ProductFilters
): URLSearchParams {
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
		filters.color.forEach((color) => params.append("color_like", color));
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

	// const queryString = params.toString();
	// console.log("Querystring: ", queryString);

	// return queryString ? `${baseUrl}?${queryString}` : baseUrl;
	return params;
}
