export interface CarParameters {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	[key: string]: any;
}
export interface AutosalonCarItem {
	name: string;
	fuel_type: 0 | 1 | 2 | 3 | 4 | 5;
	fuel_max: number;
	fuel_min: number;
	model: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	item: any;
	price: number;
	count: number;
	stock: number;
}

export interface AutosalonCarItemWithParam {
	name: string;
	fuel_type: 0 | 1 | 2 | 3 | 4 | 5;
	fuel_max: number;
	fuel_min: number;
	model: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	item: any;
	price: number;
	count: number;
	stock: number;
	parameters: CarParameters[];
}
