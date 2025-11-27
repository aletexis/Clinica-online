import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, serverTimestamp } from '@angular/fire/firestore';
import { BehaviorSubject, from, map } from 'rxjs';
import { AdminUser, AppUser, BaseUser, PatientUser, SpecialistUser } from '../models/user';


@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private auth = inject(Auth);
	private firestore = inject(Firestore);

	public userSubject = new BehaviorSubject<AppUser | null>(null);
	public user$ = this.userSubject.asObservable();

	private userInitializedSubject = new BehaviorSubject<boolean>(false);
	userInitialized$ = this.userInitializedSubject.asObservable();

	constructor() {
		onAuthStateChanged(this.auth, async (user) => {
			if (user) {
				const userData = await this.getUserData(user.uid);
				this.userSubject.next(userData);
			} else {
				this.userSubject.next(null);
			}
			this.userInitializedSubject.next(true);
		});
	}

	async register(
		email: string,
		password: string,
		role: 'patient' | 'specialist' | 'admin',
		extraData: Partial<SpecialistUser> | Partial<PatientUser> | Partial<AdminUser>,
		skipEmailVerification = false
	): Promise<AppUser> {
		const result = await createUserWithEmailAndPassword(this.auth, email, password);
		const firebaseUser = result.user;

		if (!skipEmailVerification) {
			await sendEmailVerification(firebaseUser);
		}

		const baseData = {
			uid: firebaseUser.uid,
			email,
			role,
			emailVerified: false,
			createdAt: serverTimestamp(),
		} satisfies Partial<BaseUser>;

		let userDoc: AppUser;

		switch (role) {
			case 'specialist':
				userDoc = {
					...baseData,
					...(extraData as Partial<SpecialistUser>),
					role: 'specialist',
					approved: false,
					specialties: (extraData as Partial<SpecialistUser>).specialties ?? [],
					profileImgs: (extraData as Partial<SpecialistUser>).profileImgs ?? [],
				} as SpecialistUser;
				break;

			case 'patient':
				userDoc = {
					...baseData,
					...(extraData as Partial<PatientUser>),
					role: 'patient',
					approved: true,
					healthcareProvider: (extraData as Partial<PatientUser>).healthcareProvider ?? '',
					profileImgs: (extraData as Partial<PatientUser>).profileImgs ?? [],
				} as PatientUser;
				break;

			case 'admin':
				userDoc = {
					...baseData,
					...(extraData as Partial<AdminUser>),
					role: 'admin',
					approved: true,
					profileImgs: (extraData as Partial<AdminUser>).profileImgs ?? [],
				} as AdminUser;
				break;
		}

		await setDoc(doc(this.firestore, 'users', firebaseUser.uid), userDoc);
		return userDoc;
	}

	login(email: string, password: string) {
		return from(signInWithEmailAndPassword(this.auth, email, password));
	}

	async logout() {
		await signOut(this.auth);
	}

	get isFullyAuthorized$() {
		return this.user$.pipe(
			map(user => !!user && user.approved && user.emailVerified)
		);
	}

	async getUserData(uid: string): Promise<AppUser | null> {
		const ref = doc(this.firestore, 'users', uid);
		const snap = await getDoc(ref);
		return snap.exists() ? (snap.data() as AppUser) : null;
	}

	async sendPasswordReset(email: string): Promise<void> {
		try {
			await sendPasswordResetEmail(this.auth, email);
		} catch (err) {
			console.error('Error enviando email de cambio de contraseña:', err);
			throw err;
		}
	}
}