import { Component, OnInit } from '@angular/core';
import { Schedule } from 'src/app/classes/schedule';
import { Specialist } from 'src/app/classes/specialist';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-user-admission',
  templateUrl: './user-admission.component.html',
  styleUrls: ['./user-admission.component.css'],
})
export class UserAdmissionComponent implements OnInit {
  specialists: Specialist[] = [];

  constructor(private utils: UtilsService) { }

  ngOnInit(): void {
    this.utils.getSpecialistsNotApproved().subscribe((doc) => {
      this.specialists = doc as Specialist[];
    });
    // En tu componente TypeScript
    // this.specialists = [
    //   {
    //     firstName: 'John',
    //     lastName: 'Doe',
    //     mail: 'john.doe@example.com',
    //     age: '30',
    //     dni: '123456789',
    //     password: 'password123',
    //     profileImg: 'profile.jpg',
    //     profile: 'Some profile information',
    //     approved: true,
    //     specialty: [
    //       {
    //         name: 'Cardiology',
    //         image: 'https://picsum.photos/200',
    //         schedules: [
    //           new Schedule(20, 12, 12, 12)
    //         ]
    //       },
    //     ]
    //   },
    //   {
    //     firstName: 'John',
    //     lastName: 'Doe',
    //     mail: 'john.doe@example.com',
    //     age: '30',
    //     dni: '123456789',
    //     password: 'password123',
    //     profileImg: 'profile.jpg',
    //     profile: 'Some profile information',
    //     approved: true,
    //     specialty: [
    //       {
    //         name: 'Cardiologyyyyyyyyyyyyyyyyyy',
    //         image: 'https://picsum.photos/200',
    //         schedules: [
    //           new Schedule(20, 12, 12, 12)
    //         ]
    //       },
    //       {
    //         name: 'Otra',
    //         image: 'https://picsum.photos/200',
    //         schedules: [
    //           new Schedule(20, 12, 12, 12)
    //         ]
    //       },
    //     ]
    //   },
    // ];
  }

  approve(mail: string) {
    this.utils.approveSpecialist(mail);
  }
}
