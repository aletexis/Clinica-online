export interface ClinicalRecord {
	height: number;
	weight: number;
	temperature: number;
	bloodPressure: string;
	dynamicFields?: DynamicField[];
}

interface DynamicField {
	key: string;
	value: string;
}