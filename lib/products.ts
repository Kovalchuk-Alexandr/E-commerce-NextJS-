import { Product, ProductFilters } from "@/types/product";
import dbData from "@/db.json";

// Функция для парсинга фильтров из URL параметров
export function parsFiltersFromSearchParamsObject(
	params?: { [key: string]: string | string[] | undefined }
): ProductFilters {
	if (!params) return {
		category: [],
		color: [],
		size: [],
		price: [null, null],
	};

	const filters: ProductFilters = {
		category: [],
		color: [],
		size: [],
		price: [null, null],
	};

	// Категория (может быть массивом)
	if (params.category) {
		const categories = Array.isArray(params.category)
			? params.category
			: [params.category];
		filters.category = categories;
	}

	// Цвет (может быть массивом)
	if (params.color) {
		const colors = Array.isArray(params.color)
			? params.color
			: [params.color];
		filters.color = colors;
	}

	// Размер (может быть массивом)
	if (params.size) {
		const sizes = Array.isArray(params.size)
			? params.size
			: [params.size];
		filters.size = sizes;
	}

	// Цена (два параметра: min и max)
	if (params.minPrice || params.maxPrice) {
		const minPrice = params.minPrice
			? parseFloat(Array.isArray(params.minPrice) ? params.minPrice[0] : params.minPrice)
			: null;
		const maxPrice = params.maxPrice
			? parseFloat(Array.isArray(params.maxPrice) ? params.maxPrice[0] : params.maxPrice)
			: null;
		filters.price = [minPrice, maxPrice];
	}

	return filters;
}

// Функция для создания URL параметров из фильтров
export function buildProductSearchParams(filters: ProductFilters): URLSearchParams {
	const params = new URLSearchParams();

	// Добавляем категории
	if (filters.category && filters.category.length > 0) {
		filters.category.forEach(cat => params.append('category', cat));
	}

	// Добавляем цвета
	if (filters.color && filters.color.length > 0) {
		filters.color.forEach(color => params.append('color', color));
	}

	// Добавляем размеры
	if (filters.size && filters.size.length > 0) {
		filters.size.forEach(size => params.append('size', size));
	}

	// Добавляем цену
	if (filters.price) {
		if (filters.price[0] !== null) {
			params.set('minPrice', filters.price[0].toString());
		}
		if (filters.price[1] !== null) {
			params.set('maxPrice', filters.price[1].toString());
		}
	}

	return params;
}

// Применяем фильтры к продуктам
function applyFilters(products: Product[], filters?: ProductFilters): Product[] {
	if (!filters) return products;

	let filtered = [...products];

	// Фильтр по категориям
	if (filters.category && filters.category.length > 0) {
		filtered = filtered.filter(p => 
			filters.category!.includes(p.category)
		);
	}

	// Фильтр по цветам
	if (filters.color && filters.color.length > 0) {
		filtered = filtered.filter(p => 
			filters.color!.includes(p.color)
		);
	}

	// Фильтр по размерам
	if (filters.size && filters.size.length > 0) {
		filtered = filtered.filter(p => 
			filters.size!.map(s => s.toUpperCase()).includes(p.size.toUpperCase())
		);
	}

	// Фильтр по цене
	if (filters.price) {
		const [minPrice, maxPrice] = filters.price;
		
		if (minPrice !== null) {
			filtered = filtered.filter(p => p.price >= minPrice);
		}
		
		if (maxPrice !== null) {
			filtered = filtered.filter(p => p.price <= maxPrice);
		}
	}

	return filtered;
}

// Серверная функция (для SSR/SSG) - использует статические данные
export async function fetchProductsServer(
	filters?: ProductFilters
): Promise<Product[]> {
	// Для статического экспорта просто возвращаем все продукты
	// Фильтрация будет на клиенте
	const products = dbData.products as Product[];
	
	// Но если фильтры переданы (например, из URL), применяем их
	return applyFilters(products, filters);
}

// Клиентская функция - тоже использует статические данные
export async function fetchProductsClient(
	filters?: ProductFilters
): Promise<Product[]> {
	// На клиенте работаем со статическими данными
	const products = dbData.products as Product[];
	return applyFilters(products, filters);
}

// Функция для получения всех продуктов без фильтров
export async function fetchProducts(): Promise<Product[]> {
	return dbData.products as Product[];
}