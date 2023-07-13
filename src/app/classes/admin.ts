import { User } from "./user";

export class Admin extends User {
    constructor(
        firstName: string,
        lastName: string,
        age: string,
        dni: string,
        mail: string,
        password: string,
        profileImg: string,
    ) {
        super(firstName, lastName, age, dni, mail, password, profileImg);
        this.profile = "admin";
        this.approved = true;
    }
}