export interface SpecialistAvailability {
	uid: string;
	availability: DayAvailability[];
}

export interface DayAvailability {
	day: string;
	ranges: TimeRange[];
}

export interface TimeRange {
	start: string | null;
	end: string | null;
}