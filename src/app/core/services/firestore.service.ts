import { inject, Injectable } from '@angular/core';
import {
	Firestore,
	collection,
	addDoc,
	collectionData,
	query,
	where,
	CollectionReference,
	DocumentData,
	doc,
	updateDoc,
	setDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class FirestoreService {

	firestore: Firestore = inject(Firestore);

	constructor() { }

	create<T extends DocumentData>(collectionPath: string, item: T) {
		const colRef = collection(this.firestore, collectionPath);
		return addDoc(colRef, item);
	}

	update<T extends DocumentData>(collectionPath: string, id: string, data: Partial<T>) {
		const docRef = doc(this.firestore, collectionPath, id) as any;
		return updateDoc(docRef, data as any);
	}

	setDocument<T>(collectionPath: string, id: string, data: T) {
		const docRef = doc(this.firestore, collectionPath, id);
		return setDoc(docRef, data as any);
	}

	getAll<T extends DocumentData>(collectionPath: string): Observable<T[]> {
		const colRef = collection(this.firestore, collectionPath) as CollectionReference<T>;
		return collectionData(colRef, { idField: 'id' }) as Observable<T[]>;
	}

	getFiltered<T extends DocumentData>(collectionPath: string, field: string, value: any): Observable<T[]> {
		const colRef = collection(this.firestore, collectionPath);
		const q = query(colRef, where(field, '==', value));
		return collectionData(q, { idField: 'id' }) as Observable<T[]>;
	}
}