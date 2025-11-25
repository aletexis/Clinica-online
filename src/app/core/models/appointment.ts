export interface Appointment {
	uid?: string;
	id?: string;

	patientUid: string;
	specialistUid: string;
	specialty: string;   // nombre de especialidad para no tener que joinear
	createdAt: Date;

	date: string;        // formato YYYY-MM-DD
	time: string;        // formato HH:mm

	status: AppointmentStatus;

	adminCancellationComment?: string;         // admin cancela
	patientCancellationComment?: string;       // paciente cancela
	specialistCancellationComment?: string;    // especialista cancela
	specialistRejectionComment?: string;       // especialista rechaza
	specialistReview?: string;                 // especialista finaliza turno (reseña)
	patientSurvey?: string;                    // encuesta del paciente
	patientRating?: number;                    // 1 a 5
	patientRatingComment?: string;             // comentario sobre la atención

	adminCreatedForPatientUid?: string;        // si el admin cargó turno para otro paciente
}

export type AppointmentStatus =
	| 'pending'       // Solicitado (pero todavía no aceptado)
	| 'accepted'      // Aceptado por el especialista
	| 'rejected'      // Rechazado por el especialista
	| 'cancelled'     // Cancelado por paciente/especialista/admin
	| 'completed';    // Finalizado (especialista lo marca como realizado)