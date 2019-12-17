export class Event {
  schools: string[];
  fromDate: string;
  toDate: string;
  name: string;
  userTypes: string[];
  isAllSchools: boolean;
  rncp: string;

  constructor() {
    this.schools = [];
    this.fromDate = new Date().toDateString();
    this.toDate = new Date().toDateString();
    this.name = '';
    this.userTypes = [];
    this.isAllSchools = true;
  }
}
