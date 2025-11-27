export interface ClinicalRecord {
	height: number;
	weight: number;
	temperature: number;
	bloodPressure: string;
	dynamicFields?: { key: string, value: string }[];
}