import { ClinicalRecord } from "./clinicalRecord";

export interface Appointment {
	uid?: string;
	id?: string;

	patientUid: string;
	specialistUid: string;
	specialty: string;
	createdAt: Date;

	date: string;
	time: string;

	status: AppointmentStatus;

	adminCancellationComment?: string;         // admin cancela
	patientCancellationComment?: string;       // paciente cancela
	specialistCancellationComment?: string;    // especialista cancela
	specialistRejectionComment?: string;       // especialista rechaza
	specialistReview?: {                       // especialista finaliza turno (reseña)
		comment: string;
		diagnosis: string;
	};
	patientSurvey?: string;                    // encuesta del paciente
	patientRatingComment?: string;             // comentario sobre la atención

	adminCreatedForPatientUid?: string;        // si el admin cargó turno para otro paciente

	clinicalRecord?: ClinicalRecord;
}

export type AppointmentStatus =
	| 'pending'       // Solicitado por paciente/admin
	| 'accepted'      // Aceptado por el especialista
	| 'rejected'      // Rechazado por el especialista
	| 'cancelled'     // Cancelado por paciente/especialista/admin
	| 'completed';    // Finalizado por el especialista