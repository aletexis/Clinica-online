import { Schedule } from './schedule';

export class Specialty {
  name: string;
  image: string;
  schedules: Schedule[];

  constructor(name: string, image: string) {
    this.name = name;
    this.image = image;
    this.schedules = [];
  }
}