export interface Product {
	id: number;
	title: string;
	image: string;
	price: number;
	status: "in stock" | "out of stock";
	category: string;
	color: string;
	size: string;
}

export interface ProductFilters {
	category?: string[];
	color?: string[];
	size?: string[];
	price?: [number | null, number | null];
};
