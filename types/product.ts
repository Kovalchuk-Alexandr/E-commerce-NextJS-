export interface Product {
	id: number;
	title: string;
	image: string;
	price: number;
	status: "in stock" | "out stock";
	category: string;
	color: string;
	size: string;
};
