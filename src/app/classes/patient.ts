import { User } from "./user";

export class Patient extends User {

  healthcareProvider: string;
  profileImg2: string;

  constructor(
    firstName: string,
    lastName: string,
    age: string,
    healthcareProvider: string,
    dni: string,
    mail: string,
    password: string,
    profileImg: string,
    profileImg2: string
  ) {
    super(firstName, lastName, age, dni, mail, password, profileImg);
    this.healthcareProvider = healthcareProvider;
    this.profileImg2 = profileImg2;
    this.profile = "patient";
    this.approved = true;
  }
}