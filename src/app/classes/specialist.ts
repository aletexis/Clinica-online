import { Specialty } from './specialty';
import { User } from './user';

export class Specialist extends User {
  specialty: Specialty[];

  constructor(
    firstName: string,
    lastName: string,
    age: string,
    dni: string,
    specialty: Specialty[],
    mail: string,
    password: string,
    profileImg: string
  ) {
    super(firstName, lastName, age, dni, mail, password, profileImg);
    (this.approved = false), (this.profile = 'specialist');
    this.specialty = specialty;
  }
}
