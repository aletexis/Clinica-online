export type AppUser = PatientUser | SpecialistUser | AdminUser;

export interface BaseUser {
	uid: string;
	email: string;
	password?: string;
	firstName: string;
	lastName: string;
	age: number;
	dni: string;
	role: 'patient' | 'specialist' | 'admin';
	emailVerified: boolean;
	approved: boolean;
	createdAt: any;
}

export interface SpecialistUser extends BaseUser {
	role: 'specialist';
	specialties: string[];
	profileImgs: string[];
	hasAvailability?: boolean;
}

export interface PatientUser extends BaseUser {
	role: 'patient';
	healthcareProvider: string;
	profileImgs: string[];
}

export interface AdminUser extends BaseUser {
	role: 'admin';
	profileImgs: string[];
}