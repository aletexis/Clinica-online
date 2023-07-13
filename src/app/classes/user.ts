export abstract class User {
  firstName: string;
  lastName: string;
  age: string;
  dni: string;
  mail: string;
  password: string;
  profileImg: string;
  profile: string;
  approved: boolean;

  constructor(
    firstName: string,
    lastName: string,
    age: string,
    dni: string,
    mail: string,
    password: string,
    profileImg: string,
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.dni = dni;
    this.mail = mail;
    this.password = password;
    this.profileImg = profileImg;
    this.profile = "";
    this.approved = false;
  }
}