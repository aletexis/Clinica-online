import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { AppUser, PatientUser, SpecialistUser } from '../../../core/models/user';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingService } from '../../../core/services/loading.service';
import { filter, firstValueFrom } from 'rxjs';
import { collection, getDocs } from '@angular/fire/firestore';
import { FirestoreService } from '../../../core/services/firestore.service';
import { SpecialistAvailabilityComponent } from "../../specialist/availability/specialist-availability.component";

@Component({
  selector: 'app-my-profile.page',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    SpecialistAvailabilityComponent
  ],
  templateUrl: './my-profile.page.html',
  styleUrl: './my-profile.page.scss'
})
export class MyProfilePage {
  user: AppUser | null = null;
  currentImgIndex = 0;
  specialtyNames: string[] = [];
  showAvailability = false;
  availability: any[] | null = null;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    public loadingService: LoadingService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadingService.startLoading();

    this.authService.user$
      .pipe(filter(u => u !== null))
      .subscribe(async u => {
        this.user = u;

        if (this.isSpecialist(u)) {
          await this.loadSpecialtyNames(u.specialties);
          await this.loadExistingAvailability(u.uid);
        }

        this.loadingService.stopLoading();
      });
  }

  async loadSpecialtyNames(ids: string[]) {
    const specialtiesCollection = collection(this.firestoreService.firestore, 'specialties');
    const snapshot = await getDocs(specialtiesCollection);

    const allSpecialties = snapshot.docs.map(doc => ({
      uid: doc.id,
      ...(doc.data() as any)
    }));

    this.specialtyNames = allSpecialties
      .filter(spec => ids.includes(spec.uid))
      .map(spec => spec.name);
  }

  async loadExistingAvailability(uid: string) {
    this.availability = await firstValueFrom(
      this.firestoreService.getFiltered('specialistAvailability', 'uid', uid)
    );
  }

  nextImg() {
    if (!this.user?.profileImgs) return;
    this.currentImgIndex = (this.currentImgIndex + 1) % this.user.profileImgs.length;
  }

  prevImg() {
    if (!this.user?.profileImgs) return;
    this.currentImgIndex =
      (this.currentImgIndex - 1 + this.user.profileImgs.length) %
      this.user.profileImgs.length;
  }

  setImg(i: number) {
    this.currentImgIndex = i;
  }

  isPatient(u: AppUser): u is PatientUser {
    return u.role === 'patient';
  }

  isSpecialist(u: AppUser): u is SpecialistUser {
    return u.role === 'specialist';
  }

  toggleAvailability() {
    this.showAvailability = !this.showAvailability;
  }

  onAvailabilitySaved() {
    console.log('Availability saved');

    this.toggleAvailability();
    this.loadExistingAvailability(this.user!.uid);

    this.cd.detectChanges();
  }
}